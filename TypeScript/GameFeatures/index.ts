/**
 * GameFeature script lifecycle — public entry.
 *
 * Compiles to Content/JavaScript/GameFeatures/index.js. The 4.5 bootstrap
 * (TypeScript/Main.ts) imports the lifecycle classes from here.
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
