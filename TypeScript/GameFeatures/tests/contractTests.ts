/**
 * GameFeature 脚本生命周期（M3, 4.4）的 contract tests。
 *
 * 纯逻辑 —— 对编译产物在纯 Node 下运行：
 *
 *   node --expose-gc Content/JavaScript/GameFeatures/tests/contractTests.js
 *
 * （--expose-gc 启用尽力而为的 WeakRef GC 断言；不带它测试仍会运行，
 * 只是改为断言 API 形态。）
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
// 辅助
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

/** 构建一个记录定时器/事件生命周期的 mock 适配器集合。 */
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
// 1. 幂等激活
// ---------------------------------------------------------------------------

test("repeated activate is a no-op — side effects happen once", () => {
  let activateCalls = 0;
  let deactivateCalls = 0;
  const lifecycle = new GameFeatureLifecycle();
  lifecycle.register(makeModule("m1", () => activateCalls++, () => deactivateCalls++));
  const { adapters } = makeMockAdapters();

  lifecycle.activate(adapters);
  lifecycle.activate(adapters); // 第二次 —— 必须是 no-op

  assertEqual(activateCalls, 1);
  assertEqual(deactivateCalls, 0);
  assertEqual(lifecycle.isActive, true);
  assertEqual(lifecycle.activeModuleCount, 1);

  lifecycle.deactivate();
  assertEqual(deactivateCalls, 1);
});

// ---------------------------------------------------------------------------
// 2. 幂等停用
// ---------------------------------------------------------------------------

test("repeated deactivate is a no-op", () => {
  let activateCalls = 0;
  let deactivateCalls = 0;
  const lifecycle = new GameFeatureLifecycle();
  lifecycle.register(makeModule("m1", () => activateCalls++, () => deactivateCalls++));
  const { adapters } = makeMockAdapters();

  lifecycle.activate(adapters);
  lifecycle.deactivate();
  lifecycle.deactivate(); // 第二次 —— 必须是 no-op

  assertEqual(activateCalls, 1);
  assertEqual(deactivateCalls, 1);
  assertEqual(lifecycle.isActive, false);
  assertEqual(lifecycle.activeModuleCount, 0);
});

// ---------------------------------------------------------------------------
// 3. 对激活后注册的模块重放激活
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
// 4. 重复注册幂等
// ---------------------------------------------------------------------------

test("registering the same module twice is idempotent", () => {
  let activateCalls = 0;
  const module = makeModule("m1", () => activateCalls++);
  const lifecycle = new GameFeatureLifecycle();
  lifecycle.register(module);
  lifecycle.register(module); // 重复 —— 不得重复注册

  assertEqual(lifecycle.moduleCount, 1);
  const { adapters } = makeMockAdapters();
  lifecycle.activate(adapters);
  assertEqual(activateCalls, 1);
  assertEqual(lifecycle.activeModuleCount, 1);
});

// ---------------------------------------------------------------------------
// 5. DisposableScope：停用时按 LIFO 释放
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
  assertEqual(order.length, 0); // 激活期间不释放任何东西
  lifecycle.deactivate();
  assertEqual(order.join(","), "d3,d2,d1"); // LIFO
});

test("DisposableScope is idempotent and safe after dispose", () => {
  const scope = new DisposableScope();
  const released: string[] = [];
  scope.add(() => released.push("a"));
  scope.add(() => released.push("b"));
  scope.dispose();
  scope.dispose(); // 第二次 —— no-op
  assertEqual(released.join(","), "b,a");
  // dispose 后再 add 会立即执行回调。
  scope.add(() => released.push("c"));
  assertEqual(released.join(","), "b,a,c");
});

// ---------------------------------------------------------------------------
// 6. 停用时的定时器清理
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
// 7. 停用时的拆除事件
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
// 8. 对称释放顺序：先模块 deactivate() 再释放资源
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
// 9. 弱世界引用
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
    // 该函数返回时世界对象离开作用域；只有 WeakRef 逃逸出去，
    // 因此没有任何强引用能把它留活。
    const world = { id: 42 };
    return createWorldRef(world);
  }

  const gc = (globalThis as { gc?: () => void }).gc;
  if (typeof gc !== "function") {
    // 该运行时无法强制 GC；仅断言 API 形态。
    assert(typeof createWorldRef({ id: 1 }).get === "function");
    return;
  }

  const ref = buildTransientRef();
  // V8 会保留 WeakRef 目标到当前 job 结束，因此先让出事件循环再强制 GC。
  await new Promise<void>((resolve) => setTimeout(resolve, 0));
  gc();
  gc();
  assert(ref.get() === null, "world should have been collected");
});

// ---------------------------------------------------------------------------
// 10. VM 重启后恰好重建一次
// ---------------------------------------------------------------------------

test("VM restart rebuilds the feature exactly once (no duplicate registration)", () => {
  const guard = new RebuildGuard();
  let activateCalls = 0;
  const module = makeModule("m1", () => activateCalls++);

  // 启动 #1（代数 0）。
  assertEqual(guard.beginBuild(), true);
  const lc1 = new GameFeatureLifecycle({ generation: guard.currentGeneration });
  lc1.register(module);
  lc1.register(module); // 防御性重复 —— 不得重复注册
  const mock1 = makeMockAdapters();
  lc1.activate(mock1.adapters);
  assertEqual(activateCalls, 1);
  assertEqual(lc1.activeModuleCount, 1);

  // 同一 VM 内 bootstrap 的重入 —— 忽略。
  assertEqual(guard.beginBuild(), false);

  // 旧 VM 的干净关闭。
  lc1.deactivate();
  assertEqual(lc1.activeModuleCount, 0);

  // VM 重启 → 新代数。
  guard.markVmStart();
  assertEqual(guard.currentGeneration, 1);
  assertEqual(guard.beginBuild(), true); // 新 VM 只允许一次
  const lc2 = new GameFeatureLifecycle({ generation: guard.currentGeneration });
  lc2.register(module); // 重启后重新注册同一模块
  const mock2 = makeMockAdapters();
  lc2.activate(mock2.adapters);
  assertEqual(activateCalls, 2); // 恰好多一次激活
  assertEqual(lc2.activeModuleCount, 1);

  // 新 VM 内重入 —— 忽略；无额外激活。
  assertEqual(guard.beginBuild(), false);
  assertEqual(lc2.activeModuleCount, 1);
  assertEqual(activateCalls, 2);
});

// ---------------------------------------------------------------------------
// 11. 激活中注销会对称释放
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
// 12. 作用域可独立使用（单元健全性）
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
// 运行器
// ---------------------------------------------------------------------------

// 极简 ambient 声明：让本文件无需 @types/node 也能设置非零退出码。
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
