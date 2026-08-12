/**
 * GameFeature 脚本引导（M3, 4.5）。
 *
 * 在 TypeScript/Main.ts 中调用一次：把「纯逻辑生命周期」（GameFeatures/Lifecycle）
 * 接到真实 UE 运行时 —— 构建 LifecycleAdapters（World、UE 定时器、puerts 事件总线），
 * 注册 ShooterGame 入口并激活。
 *
 * 本模块是唯一 import `ue`/`puerts` 的引导层；其余 GameFeature 代码保持纯净、
 * 可在纯 Node 下测试。本模块不可在纯 Node 中 require（'ue' 不可解析）。
 */
import * as UE from "ue";
import * as puerts from "puerts";
import { GameFeatureLifecycle, RebuildGuard } from "./Lifecycle";
import type { LifecycleAdapters } from "./Lifecycle";
import type { TimerHandle } from "./Scopes/TimerScope";
import type { EventSubscription } from "./Scopes/EventScope";
import { RegisterShooterGameFeatures } from "./Shooter/ShooterFeature";

/** 模块级重建保护：同一 VM 代数内 bootstrap 只执行一次（PIE 多实例各自独立 VM）。 */
const Guard = new RebuildGuard();

/** 当前激活的 GameFeature 生命周期；ShutdownGameFeatures() 用它在 VM 销毁前做停用清理。 */
let ActiveLifecycle: GameFeatureLifecycle<UE.World, string> | null = null;

/**
 * 构建真实 UE 适配器。
 *
 * - World：Init 阶段 World 可能尚未绑定，故用 CreateWorldRef 覆盖做「惰性 + 弱引用」：
 *   每次 Get() 重新查询 GameInstance 的当前 World，避免激活时强持有尚未存在的 World。
 * - CreateTimer：Owner 绑定 GameInstance（K2_SetTimerDelegate 依赖 Delegate.GetUObject()
 *   找 WorldContext），句柄 Cancel 时 ClearTimerHandle 并释放委托。
 * - SubscribeEvent：使用 puerts 内置事件总线（On/Off），频道为字符串事件名。
 */
function CreateUeLifecycleAdapters(GameInstance: UE.GameInstance): LifecycleAdapters<UE.World, string> {
  return {
    // 类型上非空；真实 Init 阶段可能为 null，靠下方 CreateWorldRef 覆盖兜底，不直接用默认 WeakRef。
    World: GameInstance.GetWorld(),

    CreateTimer(DelaySeconds: number, Callback: () => void, Repeating = false): TimerHandle {
      // 委托 Owner = GameInstance，使 K2_SetTimerDelegate 能解析出 WorldContext。
      const Delegate = puerts.toDelegate(GameInstance, () => Callback());
      const Handle = UE.KismetSystemLibrary.K2_SetTimerDelegate(Delegate, DelaySeconds, Repeating);
      return {
        Id: -1,
        Cancel() {
          UE.KismetSystemLibrary.K2_ClearTimerHandle(GameInstance, Handle);
        },
      };
    },

    SubscribeEvent(Channel: string, Handler: (Payload: unknown) => void): EventSubscription {
      const Listener = (...Args: unknown[]) => Handler(Args[0]);
      puerts.on(Channel, Listener);
      return {
        Id: -1,
        Unsubscribe() {
          puerts.off(Channel, Listener);
        },
      };
    },

    // 惰性 + 弱引用地解析 World：不把 World 对象强持有到生命周期里。
    CreateWorldRef() {
      return {
        Get(): UE.World | null {
          const World = GameInstance.GetWorld();
          return (World as UE.World | null) ?? null;
        },
      };
    },
  };
}

/**
 * 引导 GameFeature 生命周期并激活（Main.ts 调用一次）。
 *
 * 同一 VM 代数内重复调用为 no-op（返回 null）。返回激活后的生命周期，
 * 供调用方在需要时停用。
 */
export function BootstrapGameFeatures(
  GameInstance: UE.GameInstance,
): GameFeatureLifecycle<UE.World, string> | null {
  if (!Guard.BeginBuild()) {
    console.warn("[GameFeature] 本 VM 代数已构建过，跳过重复 bootstrap。");
    return null;
  }

  const Lifecycle = new GameFeatureLifecycle<UE.World, string>({
    Generation: Guard.CurrentGeneration,
  });
  RegisterShooterGameFeatures(Lifecycle);
  Lifecycle.Activate(CreateUeLifecycleAdapters(GameInstance));
  ActiveLifecycle = Lifecycle;

  console.log(
    `[GameFeature] ShooterGame 已激活（generation=${Guard.CurrentGeneration}，模块数=${Lifecycle.ActiveModuleCount}）。`,
  );
  return Lifecycle;
}

/**
 * 停用并释放 GameFeature 生命周期。
 *
 * 由 C++ GameInstance::Shutdown 在 Reset JsEnv 之前调用；自 M5 起模块会创建
 * UE 定时器，若不先停用，VM 销毁后定时器回调将悬空（K2_SetTimerDelegate 委托失效）。
 */
export function ShutdownGameFeatures(): void {
  if (ActiveLifecycle) {
    ActiveLifecycle.Deactivate();
    ActiveLifecycle = null;
    console.log("[GameFeature] ShooterGame 已停用，作用域已清理。");
  }
}
