/**
 * ShooterGame GameFeature 入口（M3, 4.6）的 contract tests。
 *
 * ## 作用
 * 验证 `Shooter/ShooterFeature` + `Shooter/Services/ServiceRegistry` 的契约：
 * 激活时服务组装根注册服务、停用时对称释放且无残留、事件订阅随停用拆除、
 * 模块重复注册幂等、激活中注销释放作用域，以及 ServiceRegistry 的
 * 覆盖旧条目 / 逆序释放 / 释放后拒绝注册语义。
 *
 * ## 总测试流程
 * 1. `npm run typecheck` —— 类型契约先行；
 * 2. `npm run build` —— 编译到 Content/JavaScript；
 * 3. 对编译产物在纯 Node 下运行：
 *    `node --expose-gc Content/JavaScript/GameFeatures/Tests/ShooterContractTests.js`
 * 4. 全部用例顺序执行，7 个全部通过则退出码 0；否则非零并打印失败详情。
 */
import { GameFeatureLifecycle } from "../Lifecycle";
import type { LifecycleAdapters } from "../Lifecycle";
import type { TimerHandle } from "../Scopes/TimerScope";
import type { EventSubscription } from "../Scopes/EventScope";
import { CreateShooterGameFeature, SHOOTER_GAME_FEATURE_NAME } from "../Shooter/ShooterFeature";
import { ServiceRegistry } from "../Shooter/Services/ServiceRegistry";
import { Test, Assert, AssertEqual, RunTests } from "./TestKit";

// ---------------------------------------------------------------------------
// 辅助：mock 适配器（与 ContractTests.ts 一致的最小实现）
// ---------------------------------------------------------------------------

function MakeAdapters(): LifecycleAdapters<object, string> {
  return {
    World: { Tag: "world" },
    CreateTimer(): TimerHandle {
      return { Id: 0, Cancel() {} };
    },
    SubscribeEvent(): EventSubscription {
      return { Id: 0, Unsubscribe() {} };
    },
  };
}

// ---------------------------------------------------------------------------
// 1. 激活时服务组装、停用时对称释放
// ---------------------------------------------------------------------------

Test("ShooterGame feature assembles services on Activate and disposes on Deactivate", () => {
  const Registry = new ServiceRegistry();
  const Feature = CreateShooterGameFeature({ CreateServices: () => Registry });
  const Lifecycle = new GameFeatureLifecycle<object, string>();

  Lifecycle.Register(Feature);
  Lifecycle.Activate(MakeAdapters());

  AssertEqual(Registry.Size, 1, "激活后应注册基础服务");
  Assert(Registry.Has("runtime.info"), "应存在 runtime.info 服务");

  Lifecycle.Deactivate();
  AssertEqual(Registry.Disposed, true, "停用后服务容器应已释放");
  AssertEqual(Registry.Size, 0, "停用后容器内无残留注册");
  AssertEqual(Lifecycle.ActiveModuleCount, 0);
});

// ---------------------------------------------------------------------------
// 2. 停用后事件订阅全部拆除
// ---------------------------------------------------------------------------

Test("event subscriptions made during ShooterGame Activate are torn down on Deactivate", () => {
  let Unsubscribed = 0;
  const Feature = CreateShooterGameFeature();
  const Lifecycle = new GameFeatureLifecycle<object, string>();
  Lifecycle.Register(Feature);
  Lifecycle.Activate({
    World: { Tag: "w" },
    CreateTimer(): TimerHandle {
      return { Id: 0, Cancel() {} };
    },
    SubscribeEvent(): EventSubscription {
      return {
        Id: 0,
        Unsubscribe() {
          Unsubscribed++;
        },
      };
    },
  });

  AssertEqual(Unsubscribed, 0);
  Lifecycle.Deactivate();
  AssertEqual(Unsubscribed, 1, "停用后事件订阅应被拆除");
});

// ---------------------------------------------------------------------------
// 3. 模块重复注册幂等
// ---------------------------------------------------------------------------

Test("registering the ShooterGame feature twice is idempotent", () => {
  const Lifecycle = new GameFeatureLifecycle<object, string>();
  const Feature = CreateShooterGameFeature();
  Lifecycle.Register(Feature);
  Lifecycle.Register(Feature); // 重复 —— 不得重复注册

  AssertEqual(Lifecycle.ModuleCount, 1);
  Lifecycle.Activate(MakeAdapters());
  AssertEqual(Lifecycle.ActiveModuleCount, 1);
});

// ---------------------------------------------------------------------------
// 4. ServiceRegistry 单元健全性
// ---------------------------------------------------------------------------

Test("ServiceRegistry Get/Has/overwrite semantics", () => {
  const Registry = new ServiceRegistry();
  Registry.Register("a", { V: 1 });
  AssertEqual(Registry.Get<{ V: number }>("a")?.V, 1);
  Assert(Registry.Has("a"));

  // 重复注册：释放旧条目并覆盖。
  let OldDisposed = false;
  Registry.Register("a", { V: 1 }, () => {
    OldDisposed = true;
  });
  Registry.Register("a", { V: 2 }, () => {});
  AssertEqual(OldDisposed, true, "重复注册应先释放旧条目");
  AssertEqual(Registry.Get<{ V: number }>("a")?.V, 2);
  AssertEqual(Registry.Get("missing"), undefined);
});

Test("ServiceRegistry disposes LIFO and is idempotent", () => {
  const Registry = new ServiceRegistry();
  const Order: string[] = [];
  Registry.Register("x", {}, () => Order.push("x"));
  Registry.Register("y", {}, () => Order.push("y"));
  Registry.Register("z", {}, () => Order.push("z"));

  Registry.Dispose();
  AssertEqual(Order.join(","), "z,y,x", "释放顺序应为注册顺序的逆序（LIFO）");
  AssertEqual(Registry.Disposed, true);
  AssertEqual(Registry.Size, 0);

  Registry.Dispose(); // 第二次 —— no-op
  AssertEqual(Order.join(","), "z,y,x", "重复 Dispose 不得再次执行释放回调");
});

Test("ServiceRegistry ignores register after Dispose", () => {
  const Registry = new ServiceRegistry();
  Registry.Dispose();
  Registry.Register("late", {});
  AssertEqual(Registry.Size, 0, "容器释放后不应再接受注册");
});

// ---------------------------------------------------------------------------
// 5. 激活中注销 ShooterGame 对称释放
// ---------------------------------------------------------------------------

Test("Unregistering ShooterGame while active releases its scopes", () => {
  const Registry = new ServiceRegistry();
  const Feature = CreateShooterGameFeature({ CreateServices: () => Registry });
  const Lifecycle = new GameFeatureLifecycle<object, string>();
  Lifecycle.Register(Feature);
  Lifecycle.Activate(MakeAdapters());
  AssertEqual(Lifecycle.ActiveModuleCount, 1);

  Lifecycle.Unregister(SHOOTER_GAME_FEATURE_NAME);
  AssertEqual(Lifecycle.ModuleCount, 0);
  AssertEqual(Lifecycle.ActiveModuleCount, 0);
  AssertEqual(Registry.Disposed, true, "注销激活中的模块应释放其服务容器");
});

// ---------------------------------------------------------------------------
// 运行器
// ---------------------------------------------------------------------------

declare const process: { exitCode: number };

async function Main(): Promise<void> {
  const Result = await RunTests();
  if (Result.Failed > 0) {
    throw new Error(`ShooterGame feature contract tests: ${Result.Failed} of ${Result.Total} failed`);
  }
}

Main().catch((Exception) => {
  console.error(Exception instanceof Error ? Exception.message : String(Exception));
  process.exitCode = 1;
});
