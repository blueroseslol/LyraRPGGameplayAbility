/**
 * GameFeature 脚本生命周期（M3, 4.4）的 contract tests。
 *
 * ## 作用
 * 验证 `GameFeatures/Lifecycle` 状态机的纯逻辑契约：幂等激活/停用、
 * 激活重放、重复注册幂等、停用时对称释放（Disposable LIFO / Timer / Event）、
 * 弱世界引用、VM 重启后只重建一次、激活中注销对称释放，以及各 Scope 可独立使用。
 *
 * ## 总测试流程
 * 1. `npm run typecheck` —— 类型契约先行；
 * 2. `npm run build` —— 编译到 Content/JavaScript；
 * 3. 对编译产物在纯 Node 下运行：
 *    `node --expose-gc Content/JavaScript/GameFeatures/Tests/ContractTests.js`
 *    （--expose-gc 启用尽力而为的 WeakRef GC 断言；不带它测试仍会运行，
 *    只是改为断言 API 形态。）
 * 4. 全部用例顺序执行，15 个全部通过则退出码 0；否则非零并打印失败详情。
 */
import { GameFeatureLifecycle, RebuildGuard } from "../Lifecycle";
import type {
  GameFeatureModule,
  ActivationContext,
  LifecycleAdapters,
} from "../Lifecycle";
import { DisposableScope } from "../Scopes/DisposableScope";
import { TimerScope } from "../Scopes/TimerScope";
import type { TimerHandle } from "../Scopes/TimerScope";
import { EventScope } from "../Scopes/EventScope";
import type { EventSubscription } from "../Scopes/EventScope";
import { CreateWorldRef } from "../Scopes/WeakRef";
import type { WorldRef } from "../Scopes/WeakRef";
import { Test, Assert, AssertEqual, RunTests } from "./TestKit";

// ---------------------------------------------------------------------------
// 辅助
// ---------------------------------------------------------------------------

function MakeModule(
  Name: string,
  Activate?: (Ctx: ActivationContext<object, string>) => void,
  Deactivate?: () => void,
): GameFeatureModule<object, string> {
  return {
    Name,
    Activate: Activate ?? (() => {}),
    Deactivate: Deactivate ?? (() => {}),
  };
}

interface TimerMock {
  Id: number;
  Delay: number;
  Callback: () => void;
  Repeating: boolean;
  Cancelled: boolean;
}

interface EventMock {
  Id: number;
  Channel: string;
  Unsubscribed: boolean;
}

interface MockAdapters extends LifecycleAdapters<{ Id: number }, string> {
  Timers: TimerMock[];
  Events: EventMock[];
}

/** 构建一个记录定时器/事件生命周期的 mock 适配器集合。 */
function MakeMockAdapters(): {
  Adapters: MockAdapters;
  Timers: TimerMock[];
  Events: EventMock[];
  FireTimer(TimerId: number): void;
} {
  const Timers: TimerMock[] = [];
  const Events: EventMock[] = [];
  let TimerSeq = 1;
  let EventSeq = 1;
  const Adapters: MockAdapters = {
    World: { Id: 1 },
    Timers,
    Events,
    CreateTimer(Delay: number, Callback: () => void, Repeating = false): TimerHandle {
      const Mock: TimerMock = { Id: TimerSeq++, Delay, Callback, Repeating, Cancelled: false };
      Timers.push(Mock);
      return {
        Id: Mock.Id,
        Cancel() {
          Mock.Cancelled = true;
        },
      };
    },
    SubscribeEvent(Channel: string, _Handler: (Payload: unknown) => void): EventSubscription {
      const Mock: EventMock = { Id: EventSeq++, Channel, Unsubscribed: false };
      Events.push(Mock);
      return {
        Id: Mock.Id,
        Unsubscribe() {
          Mock.Unsubscribed = true;
        },
      };
    },
  };
  return {
    Adapters,
    Timers,
    Events,
    FireTimer(TimerId: number) {
      const Mock = Timers.find((T) => T.Id === TimerId);
      if (!Mock || Mock.Cancelled) {
        return;
      }
      Mock.Callback();
      if (!Mock.Repeating) {
        Mock.Cancelled = true;
      }
    },
  };
}

// ---------------------------------------------------------------------------
// 1. 幂等激活
// ---------------------------------------------------------------------------

Test("repeated Activate is a no-op — side effects happen once", () => {
  let ActivateCalls = 0;
  let DeactivateCalls = 0;
  const Lifecycle = new GameFeatureLifecycle();
  Lifecycle.Register(MakeModule("m1", () => ActivateCalls++, () => DeactivateCalls++));
  const { Adapters } = MakeMockAdapters();

  Lifecycle.Activate(Adapters);
  Lifecycle.Activate(Adapters); // 第二次 —— 必须是 no-op

  AssertEqual(ActivateCalls, 1);
  AssertEqual(DeactivateCalls, 0);
  AssertEqual(Lifecycle.IsActive, true);
  AssertEqual(Lifecycle.ActiveModuleCount, 1);

  Lifecycle.Deactivate();
  AssertEqual(DeactivateCalls, 1);
});

// ---------------------------------------------------------------------------
// 2. 幂等停用
// ---------------------------------------------------------------------------

Test("repeated Deactivate is a no-op", () => {
  let ActivateCalls = 0;
  let DeactivateCalls = 0;
  const Lifecycle = new GameFeatureLifecycle();
  Lifecycle.Register(MakeModule("m1", () => ActivateCalls++, () => DeactivateCalls++));
  const { Adapters } = MakeMockAdapters();

  Lifecycle.Activate(Adapters);
  Lifecycle.Deactivate();
  Lifecycle.Deactivate(); // 第二次 —— 必须是 no-op

  AssertEqual(ActivateCalls, 1);
  AssertEqual(DeactivateCalls, 1);
  AssertEqual(Lifecycle.IsActive, false);
  AssertEqual(Lifecycle.ActiveModuleCount, 0);
});

// ---------------------------------------------------------------------------
// 3. 对激活后注册的模块重放激活
// ---------------------------------------------------------------------------

Test("modules registered after activation get activation replayed", () => {
  const Order: string[] = [];
  const Lifecycle = new GameFeatureLifecycle();
  Lifecycle.Register(MakeModule("early", () => Order.push("early:on"), () => Order.push("early:off")));
  const { Adapters } = MakeMockAdapters();

  Lifecycle.Activate(Adapters);
  AssertEqual(Order.join(","), "early:on");

  Lifecycle.Register(MakeModule("late", () => Order.push("late:on"), () => Order.push("late:off")));
  AssertEqual(Lifecycle.ActiveModuleCount, 2);
  AssertEqual(Order.filter((X) => X === "late:on").length, 1);

  Lifecycle.Deactivate();
  AssertEqual(Order.join(","), "early:on,late:on,late:off,early:off");
});

// ---------------------------------------------------------------------------
// 4. 重复注册幂等
// ---------------------------------------------------------------------------

Test("registering the same module twice is idempotent", () => {
  let ActivateCalls = 0;
  const Module = MakeModule("m1", () => ActivateCalls++);
  const Lifecycle = new GameFeatureLifecycle();
  Lifecycle.Register(Module);
  Lifecycle.Register(Module); // 重复 —— 不得重复注册

  AssertEqual(Lifecycle.ModuleCount, 1);
  const { Adapters } = MakeMockAdapters();
  Lifecycle.Activate(Adapters);
  AssertEqual(ActivateCalls, 1);
  AssertEqual(Lifecycle.ActiveModuleCount, 1);
});

// ---------------------------------------------------------------------------
// 5. DisposableScope：停用时按 LIFO 释放
// ---------------------------------------------------------------------------

Test("DisposableScope releases LIFO on Deactivate", () => {
  const Order: string[] = [];
  const Lifecycle = new GameFeatureLifecycle();
  Lifecycle.Register({
    Name: "m1",
    Activate(Ctx) {
      Ctx.Disposables.Add(() => Order.push("d1"));
      Ctx.Disposables.Add(() => Order.push("d2"));
      Ctx.Disposables.Add(() => Order.push("d3"));
    },
    Deactivate() {},
  });
  const { Adapters } = MakeMockAdapters();

  Lifecycle.Activate(Adapters);
  AssertEqual(Order.length, 0); // 激活期间不释放任何东西
  Lifecycle.Deactivate();
  AssertEqual(Order.join(","), "d3,d2,d1"); // LIFO
});

Test("DisposableScope is idempotent and safe after Dispose", () => {
  const Scope = new DisposableScope();
  const Released: string[] = [];
  Scope.Add(() => Released.push("a"));
  Scope.Add(() => Released.push("b"));
  Scope.Dispose();
  Scope.Dispose(); // 第二次 —— no-op
  AssertEqual(Released.join(","), "b,a");
  // Dispose 后再 Add 会立即执行回调。
  Scope.Add(() => Released.push("c"));
  AssertEqual(Released.join(","), "b,a,c");
});

// ---------------------------------------------------------------------------
// 6. 停用时的定时器清理
// ---------------------------------------------------------------------------

Test("timers created during Activate are all cancelled on Deactivate", () => {
  const Mock = MakeMockAdapters();
  const Lifecycle = new GameFeatureLifecycle();
  Lifecycle.Register({
    Name: "m1",
    Activate(Ctx) {
      Ctx.Timers.Set(1.0, () => {});
      Ctx.Timers.Set(2.0, () => {}, true);
    },
    Deactivate() {},
  });

  Lifecycle.Activate(Mock.Adapters);
  AssertEqual(Mock.Timers.length, 2);
  AssertEqual(Mock.Timers.every((T) => !T.Cancelled), true);

  Lifecycle.Deactivate();
  AssertEqual(Mock.Timers.every((T) => T.Cancelled), true);
});

Test("a manually cancelled timer is released from the scope", () => {
  const Mock = MakeMockAdapters();
  const Lifecycle = new GameFeatureLifecycle();
  Lifecycle.Register({
    Name: "m1",
    Activate(Ctx) {
      const Handle = Ctx.Timers.Set(1.0, () => {});
      Handle.Cancel();
    },
    Deactivate() {},
  });
  Lifecycle.Activate(Mock.Adapters);
  AssertEqual(Mock.Timers.length, 1);
  AssertEqual(Mock.Timers[0].Cancelled, true);
});

// ---------------------------------------------------------------------------
// 7. 停用时的拆除事件
// ---------------------------------------------------------------------------

Test("event subscriptions made during Activate are torn down on Deactivate", () => {
  const Mock = MakeMockAdapters();
  const Lifecycle = new GameFeatureLifecycle();
  Lifecycle.Register({
    Name: "m1",
    Activate(Ctx) {
      Ctx.Events.On("Foo", () => {});
      Ctx.Events.On("Bar", () => {});
    },
    Deactivate() {},
  });

  Lifecycle.Activate(Mock.Adapters);
  AssertEqual(Mock.Events.length, 2);
  AssertEqual(Mock.Events.every((E) => !E.Unsubscribed), true);

  Lifecycle.Deactivate();
  AssertEqual(Mock.Events.every((E) => E.Unsubscribed), true);
});

// ---------------------------------------------------------------------------
// 8. 对称释放顺序：先模块 Deactivate() 再释放资源
// ---------------------------------------------------------------------------

Test("Deactivate runs Module.Deactivate() then releases resources", () => {
  const Order: string[] = [];
  const Lifecycle = new GameFeatureLifecycle();
  Lifecycle.Register({
    Name: "m1",
    Activate(Ctx) {
      Ctx.Disposables.Add(() => Order.push("disposable"));
      Ctx.Timers.Set(1.0, () => {});
      Ctx.Events.On("E", () => {});
    },
    Deactivate() {
      Order.push("Module.Deactivate");
    },
  });
  const Mock = MakeMockAdapters();

  Lifecycle.Activate(Mock.Adapters);
  Lifecycle.Deactivate();

  AssertEqual(Order.join(","), "Module.Deactivate,disposable");
  AssertEqual(Mock.Timers.every((T) => T.Cancelled), true);
  AssertEqual(Mock.Events.every((E) => E.Unsubscribed), true);
});

// ---------------------------------------------------------------------------
// 9. 弱世界引用
// ---------------------------------------------------------------------------

Test("modules receive a weak world reference, not the world itself", () => {
  const Captured: { Value: WorldRef<{ Id: number }> | null } = { Value: null };
  const Lifecycle = new GameFeatureLifecycle<{ Id: number }, string>();
  Lifecycle.Register({
    Name: "m1",
    Activate(Ctx) {
      Captured.Value = Ctx.World;
    },
    Deactivate() {},
  });
  const { Adapters } = MakeMockAdapters();

  Lifecycle.Activate(Adapters);
  Assert(Captured.Value !== null, "module should have captured a world ref");
  AssertEqual(Captured.Value?.Get()?.Id, 1);
});

Test("CreateWorldRef does not retain the world strongly (best-effort GC)", async () => {
  function BuildTransientRef(): WorldRef<{ Id: number }> {
    // 该函数返回时世界对象离开作用域；只有 WeakRef 逃逸出去，
    // 因此没有任何强引用能把它留活。
    const World = { Id: 42 };
    return CreateWorldRef(World);
  }

  const Gc = (globalThis as { gc?: () => void }).gc;
  if (typeof Gc !== "function") {
    // 该运行时无法强制 GC；仅断言 API 形态。
    Assert(typeof CreateWorldRef({ Id: 1 }).Get === "function");
    return;
  }

  const Ref = BuildTransientRef();
  // V8 会保留 WeakRef 目标到当前 job 结束，因此先让出事件循环再强制 GC。
  await new Promise<void>((Resolve) => setTimeout(Resolve, 0));
  Gc();
  Gc();
  Assert(Ref.Get() === null, "world should have been collected");
});

// ---------------------------------------------------------------------------
// 10. VM 重启后恰好重建一次
// ---------------------------------------------------------------------------

Test("VM restart rebuilds the feature exactly once (no duplicate registration)", () => {
  const Guard = new RebuildGuard();
  let ActivateCalls = 0;
  const Module = MakeModule("m1", () => ActivateCalls++);

  // 启动 #1（代数 0）。
  AssertEqual(Guard.BeginBuild(), true);
  const Lc1 = new GameFeatureLifecycle({ Generation: Guard.CurrentGeneration });
  Lc1.Register(Module);
  Lc1.Register(Module); // 防御性重复 —— 不得重复注册
  const Mock1 = MakeMockAdapters();
  Lc1.Activate(Mock1.Adapters);
  AssertEqual(ActivateCalls, 1);
  AssertEqual(Lc1.ActiveModuleCount, 1);

  // 同一 VM 内 bootstrap 的重入 —— 忽略。
  AssertEqual(Guard.BeginBuild(), false);

  // 旧 VM 的干净关闭。
  Lc1.Deactivate();
  AssertEqual(Lc1.ActiveModuleCount, 0);

  // VM 重启 → 新代数。
  Guard.MarkVmStart();
  AssertEqual(Guard.CurrentGeneration, 1);
  AssertEqual(Guard.BeginBuild(), true); // 新 VM 只允许一次
  const Lc2 = new GameFeatureLifecycle({ Generation: Guard.CurrentGeneration });
  Lc2.Register(Module); // 重启后重新注册同一模块
  const Mock2 = MakeMockAdapters();
  Lc2.Activate(Mock2.Adapters);
  AssertEqual(ActivateCalls, 2); // 恰好多一次激活
  AssertEqual(Lc2.ActiveModuleCount, 1);

  // 新 VM 内重入 —— 忽略；无额外激活。
  AssertEqual(Guard.BeginBuild(), false);
  AssertEqual(Lc2.ActiveModuleCount, 1);
  AssertEqual(ActivateCalls, 2);
});

// ---------------------------------------------------------------------------
// 11. 激活中注销会对称释放
// ---------------------------------------------------------------------------

Test("Unregister while active symmetrically releases the module", () => {
  let DeactivateCalls = 0;
  const Lifecycle = new GameFeatureLifecycle();
  const Module = MakeModule("m1", () => {}, () => DeactivateCalls++);
  Lifecycle.Register(Module);
  const { Adapters } = MakeMockAdapters();
  Lifecycle.Activate(Adapters);

  Lifecycle.Unregister(Module);
  AssertEqual(DeactivateCalls, 1);
  AssertEqual(Lifecycle.ModuleCount, 0);
  AssertEqual(Lifecycle.ActiveModuleCount, 0);
});

// ---------------------------------------------------------------------------
// 12. 作用域可独立使用（单元健全性）
// ---------------------------------------------------------------------------

Test("TimerScope/EventScope track and release standalone", () => {
  const Mock = MakeMockAdapters();
  const Timers = new TimerScope({ CreateTimer: (D, Cb, R) => Mock.Adapters.CreateTimer(D, Cb, R) });
  const Events = new EventScope<string>({ Subscribe: (Ch, H) => Mock.Adapters.SubscribeEvent(Ch, H) });

  Timers.Set(0.5, () => {});
  Events.On("X", () => {});
  AssertEqual(Timers.Size, 1);
  AssertEqual(Events.Size, 1);

  Timers.CancelAll();
  Events.Clear();
  AssertEqual(Timers.Size, 0);
  AssertEqual(Events.Size, 0);
  AssertEqual(Mock.Timers[0].Cancelled, true);
  AssertEqual(Mock.Events[0].Unsubscribed, true);
});

// ---------------------------------------------------------------------------
// 运行器
// ---------------------------------------------------------------------------

// 极简 ambient 声明：让本文件无需 @types/node 也能设置非零退出码。
declare const process: { exitCode: number };

async function Main(): Promise<void> {
  const Result = await RunTests();
  if (Result.Failed > 0) {
    throw new Error(`GameFeature contract tests: ${Result.Failed} of ${Result.Total} failed`);
  }
}

Main().catch((Exception) => {
  console.error(Exception instanceof Error ? Exception.message : String(Exception));
  process.exitCode = 1;
});
