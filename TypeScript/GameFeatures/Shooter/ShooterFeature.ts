/**
 * ShooterGame 的 GameFeature TS 入口（M3, 4.6）。
 *
 * Activate() 时执行「服务组装」：创建服务容器并注册玩法服务，所有资源都挂到
 * 激活作用域（Ctx.Disposables / Ctx.Timers / Ctx.Events），停用时由生命周期
 * 对称释放，作用域内无残留注册。后续里程碑在此挂载传送协调器、对局阶段协调器等。
 *
 * 纯逻辑 —— 无 UE 依赖，可在纯 Node 下测试。
 */
import type { GameFeatureModule, ActivationContext, GameFeatureLifecycle } from "../Lifecycle";
import { ServiceRegistry } from "./Services/ServiceRegistry";

/** 模块名：稳定的功能标识（PIE 多实例下每个 VM 各注册一份）。 */
export const SHOOTER_GAME_FEATURE_NAME = "ShooterGame";

/** CreateShooterGameFeature 的构造选项（测试用）。 */
export interface ShooterGameFeatureOptions {
  /** 服务容器工厂；默认新建 ServiceRegistry。 */
  CreateServices?: () => ServiceRegistry;
}

/**
 * 创建 ShooterGame GameFeature 模块。
 *
 * @param Options 可注入服务容器工厂（contract tests 注入内存版本）。
 */
export function CreateShooterGameFeature<TWorld extends object = object>(
  Options: ShooterGameFeatureOptions = {},
): GameFeatureModule<TWorld, string> {
  const CreateServices = Options.CreateServices ?? (() => new ServiceRegistry());

  return {
    Name: SHOOTER_GAME_FEATURE_NAME,

    Activate(Ctx: ActivationContext<TWorld, string>) {
      // 服务组装根：所有玩法服务在此注册；停用时随 Ctx.Disposables 逆序释放。
      const Services = CreateServices();
      Ctx.Disposables.Add(() => Services.Dispose());

      // 基础服务（占位）：M4/M5 在此挂载实际玩法服务，例如：
      //   Services.Register("travel.coordinator", CreateTravelCoordinator());
      //   Services.Register("match.phase", CreateMatchPhaseCoordinator());
      Services.Register("runtime.info", {
        feature: SHOOTER_GAME_FEATURE_NAME,
        activated: true,
      });

      // 订阅一条示例事件，验证事件订阅随停用拆除。
      Ctx.Events.On("GameplayRuntime.Start", (_Payload: unknown) => {
        console.log(`[ShooterGame] GameplayRuntime.Start（${SHOOTER_GAME_FEATURE_NAME}）`);
      });
    },

    Deactivate() {
      // 所有清理已挂到 Ctx 作用域，由生命周期对称释放；模块自身无需额外清理。
    },
  };
}

/**
 * 把 ShooterGame 的全部 GameFeature 模块注册进生命周期（供 bootstrap 调用）。
 * 幂等 —— 重复注册同名模块为 no-op（见 Lifecycle.Register）。
 */
export function RegisterShooterGameFeatures<TWorld extends object>(
  Lifecycle: GameFeatureLifecycle<TWorld, string>,
): void {
  Lifecycle.Register(CreateShooterGameFeature<TWorld>());
}
