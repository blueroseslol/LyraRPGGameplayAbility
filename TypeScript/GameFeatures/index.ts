/**
 * GameFeature 脚本生命周期 —— 公共入口。
 *
 * 编译产物为 Content/JavaScript/GameFeatures/index.js。4.5 的 bootstrap
 * （TypeScript/Main.ts）从这里导入生命周期类。
 */
export { GameFeatureLifecycle, RebuildGuard } from "./lifecycle";
export type {
  GameFeatureModule,
  ActivationContext,
  LifecycleAdapters,
  GameFeatureLifecycleOptions,
} from "./lifecycle";
export { DisposableScope } from "./scopes/disposableScope";
export type { Disposer } from "./scopes/disposableScope";
export { TimerScope } from "./scopes/timerScope";
export type { TimerHandle, TimerFactory } from "./scopes/timerScope";
export { EventScope } from "./scopes/eventScope";
export type { EventChannel, EventSubscription, EventSubscriber } from "./scopes/eventScope";
export { createWorldRef } from "./scopes/weakRef";
export type { WorldRef } from "./scopes/weakRef";
