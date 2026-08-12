/**
 * Contract tests for the GameFeature script lifecycle (M3, 4.4).
 *
 * Pure logic — runs under plain Node against the compiled output:
 *
 *   node --expose-gc Content/JavaScript/GameFeatures/tests/contractTests.js
 *
 * (--expose-gc enables the best-effort WeakRef GC assertion; without it the
 * test still runs and just asserts the API shape.)
 */
import {
  GameFeatureLifecycle,
  RebuildGuard,
  DisposableScope,
  TimerScope,
  EventScope,
  createWorldRef,
} from "../index";
import type {
  GameFeatureModule,
  ActivationContext,
  LifecycleAdapters,
  WorldRef,
  TimerHandle,
  EventSubscription,
} from "../index";
import { test, assert, assertEqual, runTests } from "./testKit";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeModule(
  name: string,
  activate?: (ctx: ActivationContext<object, string>) => void,
  deactivate?: () => void,
): GameFeatureModule<object, string> {
  return {
    name,
    activate: activate ?? (() => {}),
    deactivate: deactivate ?? (() => {}),
  };
}

interface TimerMock {
  id: number;
  delay: number;
  callback: () => void;
  repeating: boolean;
  cancelled: boolean;
}

interface EventMock {
  id: number;
  channel: string;
  unsubscribed: boolean;
}

interface MockAdapters extends LifecycleAdapters<{ id: number }, string> {
  timers: TimerMock[];
  events: EventMock[];
}

/** Build a mock adapter bundle that records timer/event lifecycle. */
function makeMockAdapters(): {
  adapters: MockAdapters;
  timers: TimerMock[];
  events: EventMock[];
  fireTimer(timerId: number): void;
} {
  const timers: TimerMock[] = [];
  const events: EventMock[] = [];
  let timerSeq = 1;
  let eventSeq = 1;
  const adapters: MockAdapters = {
    world: { id: 1 },
    timers,
    events,
    createTimer(delay: number, callback: () => void, repeating = false): TimerHandle {
      const mock: TimerMock = { id: timerSeq++, delay, callback, repeating, cancelled: false };
      timers.push(mock);
      return {
        id: mock.id,
        cancel() {
          mock.cancelled = true;
        },
      };
    },
    subscribeEvent(channel: string, _handler: (payload: unknown) => void): EventSubscription {
      const mock: EventMock = { id: eventSeq++, channel, unsubscribed: false };
      events.push(mock);
      return {
        id: mock.id,
        unsubscribe() {
          mock.unsubscribed = true;
        },
      };
    },
  };
  return {
    adapters,
    timers,
    events,
    fireTimer(timerId: number) {
      const mock = timers.find((t) => t.id === timerId);
      if (!mock || mock.cancelled) {
        return;
      }
      mock.callback();
      if (!mock.repeating) {
        mock.cancelled = true;
      }
    },
  };
}

// ---------------------------------------------------------------------------
// 1. Idempotent activation
// ---------------------------------------------------------------------------

test("repeated activate is a no-op — side effects happen once", () => {
  let activateCalls = 0;
  let deactivateCalls = 0;
  const lifecycle = new GameFeatureLifecycle();
  lifecycle.register(makeModule("m1", () => activateCalls++, () => deactivateCalls++));
  const { adapters } = makeMockAdapters();

  lifecycle.activate(adapters);
  lifecycle.activate(adapters); // second — must be a no-op

  assertEqual(activateCalls, 1);
  assertEqual(deactivateCalls, 0);
  assertEqual(lifecycle.isActive, true);
  assertEqual(lifecycle.activeModuleCount, 1);

  lifecycle.deactivate();
  assertEqual(deactivateCalls, 1);
});

// ---------------------------------------------------------------------------
// 2. Idempotent deactivation
// ---------------------------------------------------------------------------

test("repeated deactivate is a no-op", () => {
  let activateCalls = 0;
  let deactivateCalls = 0;
  const lifecycle = new GameFeatureLifecycle();
  lifecycle.register(makeModule("m1", () => activateCalls++, () => deactivateCalls++));
  const { adapters } = makeMockAdapters();

  lifecycle.activate(adapters);
  lifecycle.deactivate();
  lifecycle.deactivate(); // second — must be a no-op

  assertEqual(activateCalls, 1);
  assertEqual(deactivateCalls, 1);
  assertEqual(lifecycle.isActive, false);
  assertEqual(lifecycle.activeModuleCount, 0);
});

// ---------------------------------------------------------------------------
// 3. Activation replay for modules registered after activation
// ---------------------------------------------------------------------------

test("modules registered after activation get activation replayed", () => {
  const order: string[] = [];
  const lifecycle = new GameFeatureLifecycle();
  lifecycle.register(makeModule("early", () => order.push("early:on"), () => order.push("early:off")));
  const { adapters } = makeMockAdapters();

  lifecycle.activate(adapters);
  assertEqual(order.join(","), "early:on");

  lifecycle.register(makeModule("late", () => order.push("late:on"), () => order.push("late:off")));
  assertEqual(lifecycle.activeModuleCount, 2);
  assertEqual(order.filter((x) => x === "late:on").length, 1);

  lifecycle.deactivate();
  assertEqual(order.join(","), "early:on,late:on,late:off,early:off");
});

// ---------------------------------------------------------------------------
// 4. Duplicate registration is idempotent
// ---------------------------------------------------------------------------

test("registering the same module twice is idempotent", () => {
  let activateCalls = 0;
  const module = makeModule("m1", () => activateCalls++);
  const lifecycle = new GameFeatureLifecycle();
  lifecycle.register(module);
  lifecycle.register(module); // duplicate — must not double register

  assertEqual(lifecycle.moduleCount, 1);
  const { adapters } = makeMockAdapters();
  lifecycle.activate(adapters);
  assertEqual(activateCalls, 1);
  assertEqual(lifecycle.activeModuleCount, 1);
});

// ---------------------------------------------------------------------------
// 5. DisposableScope: LIFO release on deactivate
// ---------------------------------------------------------------------------

test("DisposableScope releases LIFO on deactivate", () => {
  const order: string[] = [];
  const lifecycle = new GameFeatureLifecycle();
  lifecycle.register({
    name: "m1",
    activate(ctx) {
      ctx.disposables.add(() => order.push("d1"));
      ctx.disposables.add(() => order.push("d2"));
      ctx.disposables.add(() => order.push("d3"));
    },
    deactivate() {},
  });
  const { adapters } = makeMockAdapters();

  lifecycle.activate(adapters);
  assertEqual(order.length, 0); // nothing released while active
  lifecycle.deactivate();
  assertEqual(order.join(","), "d3,d2,d1"); // LIFO
});

test("DisposableScope is idempotent and safe after dispose", () => {
  const scope = new DisposableScope();
  const released: string[] = [];
  scope.add(() => released.push("a"));
  scope.add(() => released.push("b"));
  scope.dispose();
  scope.dispose(); // second — no-op
  assertEqual(released.join(","), "b,a");
  // Adding after dispose runs the callback immediately.
  scope.add(() => released.push("c"));
  assertEqual(released.join(","), "b,a,c");
});

// ---------------------------------------------------------------------------
// 6. Timer cleanup on deactivate
// ---------------------------------------------------------------------------

test("timers created during activate are all cancelled on deactivate", () => {
  const mock = makeMockAdapters();
  const lifecycle = new GameFeatureLifecycle();
  lifecycle.register({
    name: "m1",
    activate(ctx) {
      ctx.timers.set(1.0, () => {});
      ctx.timers.set(2.0, () => {}, true);
    },
    deactivate() {},
  });

  lifecycle.activate(mock.adapters);
  assertEqual(mock.timers.length, 2);
  assertEqual(mock.timers.every((t) => !t.cancelled), true);

  lifecycle.deactivate();
  assertEqual(mock.timers.every((t) => t.cancelled), true);
});

test("a manually cancelled timer is released from the scope", () => {
  const mock = makeMockAdapters();
  const lifecycle = new GameFeatureLifecycle();
  lifecycle.register({
    name: "m1",
    activate(ctx) {
      const handle = ctx.timers.set(1.0, () => {});
      handle.cancel();
    },
    deactivate() {},
  });
  lifecycle.activate(mock.adapters);
  assertEqual(mock.timers.length, 1);
  assertEqual(mock.timers[0].cancelled, true);
});

// ---------------------------------------------------------------------------
// 7. Event teardown on deactivate
// ---------------------------------------------------------------------------

test("event subscriptions made during activate are torn down on deactivate", () => {
  const mock = makeMockAdapters();
  const lifecycle = new GameFeatureLifecycle();
  lifecycle.register({
    name: "m1",
    activate(ctx) {
      ctx.events.on("Foo", () => {});
      ctx.events.on("Bar", () => {});
    },
    deactivate() {},
  });

  lifecycle.activate(mock.adapters);
  assertEqual(mock.events.length, 2);
  assertEqual(mock.events.every((e) => !e.unsubscribed), true);

  lifecycle.deactivate();
  assertEqual(mock.events.every((e) => e.unsubscribed), true);
});

// ---------------------------------------------------------------------------
// 8. Symmetric release order: module.deactivate() before resource release
// ---------------------------------------------------------------------------

test("deactivate runs module.deactivate() then releases resources", () => {
  const order: string[] = [];
  const lifecycle = new GameFeatureLifecycle();
  lifecycle.register({
    name: "m1",
    activate(ctx) {
      ctx.disposables.add(() => order.push("disposable"));
      ctx.timers.set(1.0, () => {});
      ctx.events.on("E", () => {});
    },
    deactivate() {
      order.push("module.deactivate");
    },
  });
  const mock = makeMockAdapters();

  lifecycle.activate(mock.adapters);
  lifecycle.deactivate();

  assertEqual(order.join(","), "module.deactivate,disposable");
  assertEqual(mock.timers.every((t) => t.cancelled), true);
  assertEqual(mock.events.every((e) => e.unsubscribed), true);
});

// ---------------------------------------------------------------------------
// 9. Weak world reference
// ---------------------------------------------------------------------------

test("modules receive a weak world reference, not the world itself", () => {
  const captured: { value: WorldRef<{ id: number }> | null } = { value: null };
  const lifecycle = new GameFeatureLifecycle<{ id: number }, string>();
  lifecycle.register({
    name: "m1",
    activate(ctx) {
      captured.value = ctx.world;
    },
    deactivate() {},
  });
  const { adapters } = makeMockAdapters();

  lifecycle.activate(adapters);
  assert(captured.value !== null, "module should have captured a world ref");
  assertEqual(captured.value.get()?.id, 1);
});

test("createWorldRef does not retain the world strongly (best-effort GC)", async () => {
  function buildTransientRef(): WorldRef<{ id: number }> {
    // The world goes out of scope when this function returns; only the WeakRef
    // escapes, so there is no strong reference left to keep it alive.
    const world = { id: 42 };
    return createWorldRef(world);
  }

  const gc = (globalThis as { gc?: () => void }).gc;
  if (typeof gc !== "function") {
    // Cannot force GC in this runtime; just assert the API shape.
    assert(typeof createWorldRef({ id: 1 }).get === "function");
    return;
  }

  const ref = buildTransientRef();
  // V8 keeps WeakRef targets alive until the end of the current job, so yield
  // to the event loop before forcing GC.
  await new Promise<void>((resolve) => setTimeout(resolve, 0));
  gc();
  gc();
  assert(ref.get() === null, "world should have been collected");
});

// ---------------------------------------------------------------------------
// 10. VM restart rebuilds exactly once
// ---------------------------------------------------------------------------

test("VM restart rebuilds the feature exactly once (no duplicate registration)", () => {
  const guard = new RebuildGuard();
  let activateCalls = 0;
  const module = makeModule("m1", () => activateCalls++);

  // Boot #1 (generation 0).
  assertEqual(guard.beginBuild(), true);
  const lc1 = new GameFeatureLifecycle({ generation: guard.currentGeneration });
  lc1.register(module);
  lc1.register(module); // defensive duplicate — must not double-register
  const mock1 = makeMockAdapters();
  lc1.activate(mock1.adapters);
  assertEqual(activateCalls, 1);
  assertEqual(lc1.activeModuleCount, 1);

  // Re-entry of the same bootstrap in the same VM — ignored.
  assertEqual(guard.beginBuild(), false);

  // Clean shutdown of the old VM.
  lc1.deactivate();
  assertEqual(lc1.activeModuleCount, 0);

  // VM restart → new generation.
  guard.markVmStart();
  assertEqual(guard.currentGeneration, 1);
  assertEqual(guard.beginBuild(), true); // allowed once for the new VM
  const lc2 = new GameFeatureLifecycle({ generation: guard.currentGeneration });
  lc2.register(module); // re-register the same module after restart
  const mock2 = makeMockAdapters();
  lc2.activate(mock2.adapters);
  assertEqual(activateCalls, 2); // exactly one more activation
  assertEqual(lc2.activeModuleCount, 1);

  // Re-entry in the new VM — ignored; no extra activation.
  assertEqual(guard.beginBuild(), false);
  assertEqual(lc2.activeModuleCount, 1);
  assertEqual(activateCalls, 2);
});

// ---------------------------------------------------------------------------
// 11. Unregister while active symmetrically releases
// ---------------------------------------------------------------------------

test("unregister while active symmetrically releases the module", () => {
  let deactivateCalls = 0;
  const lifecycle = new GameFeatureLifecycle();
  const module = makeModule("m1", () => {}, () => deactivateCalls++);
  lifecycle.register(module);
  const { adapters } = makeMockAdapters();
  lifecycle.activate(adapters);

  lifecycle.unregister(module);
  assertEqual(deactivateCalls, 1);
  assertEqual(lifecycle.moduleCount, 0);
  assertEqual(lifecycle.activeModuleCount, 0);
});

// ---------------------------------------------------------------------------
// 12. Scopes are usable standalone (unit sanity)
// ---------------------------------------------------------------------------

test("TimerScope/EventScope track and release standalone", () => {
  const mock = makeMockAdapters();
  const timers = new TimerScope({ createTimer: (d, cb, r) => mock.adapters.createTimer(d, cb, r) });
  const events = new EventScope<string>({ subscribe: (c, h) => mock.adapters.subscribeEvent(c, h) });

  timers.set(0.5, () => {});
  events.on("X", () => {});
  assertEqual(timers.size, 1);
  assertEqual(events.size, 1);

  timers.cancelAll();
  events.clear();
  assertEqual(timers.size, 0);
  assertEqual(events.size, 0);
  assertEqual(mock.timers[0].cancelled, true);
  assertEqual(mock.events[0].unsubscribed, true);
});

// ---------------------------------------------------------------------------
// Runner
// ---------------------------------------------------------------------------

// Minimal ambient so this file can set a non-zero exit code without @types/node.
declare const process: { exitCode: number };

async function main(): Promise<void> {
  const result = await runTests();
  if (result.failed > 0) {
    throw new Error(`GameFeature contract tests: ${result.failed} of ${result.total} failed`);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
