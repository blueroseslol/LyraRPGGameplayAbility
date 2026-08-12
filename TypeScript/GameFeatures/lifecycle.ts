/**
 * GameFeature script lifecycle — pure, UE-free core.
 *
 * All UE-touching dependencies (world, timers, events) arrive as an injected
 * `LifecycleAdapters` bundle at activation time. The state machine here only
 * reasons about registered modules and activation state, so it can be tested
 * under plain Node without an Unreal runtime.
 *
 * Guarantees:
 *  - register/unregister are name-idempotent.
 *  - activate()/deactivate() are idempotent.
 *  - modules registered while the feature is already active get their
 *    activation state replayed immediately.
 *  - deactivate() symmetrically releases everything created by activate():
 *    the module's own deactivate(), then timer cancellation, then LIFO
 *    disposable release, then event teardown.
 */
import { DisposableScope } from "./scopes/disposableScope";
import { TimerScope } from "./scopes/timerScope";
import type { TimerHandle } from "./scopes/timerScope";
import { EventScope } from "./scopes/eventScope";
import type { EventChannel, EventSubscription } from "./scopes/eventScope";
import { createWorldRef } from "./scopes/weakRef";
import type { WorldRef } from "./scopes/weakRef";

/** Adapter bundle injected at activation time (created by the UE-side bootstrap). */
export interface LifecycleAdapters<TWorld extends object = object, TChannel extends EventChannel = string> {
  /** The world this activation is scoped to. Only ever handed to modules weakly. */
  world: TWorld;
  /** Create a real timer; the returned handle can cancel it. */
  createTimer(delaySeconds: number, callback: () => void, repeating?: boolean): TimerHandle;
  /** Subscribe to a real event channel; the returned handle unsubscribes. */
  subscribeEvent(channel: TChannel, handler: (payload: unknown) => void): EventSubscription;
  /** Optional override for building the weak world reference. */
  createWorldRef?(world: TWorld): WorldRef<TWorld>;
}

/** Per-module activation context — the only things a module may hold onto. */
export interface ActivationContext<TWorld extends object = object, TChannel extends EventChannel = string> {
  /** Weak reference to the world (never the world itself — avoids leaks). */
  readonly world: WorldRef<TWorld>;
  /** Timers created here are cancelled automatically on deactivate. */
  readonly timers: TimerScope;
  /** Cleanup callbacks run LIFO on deactivate. */
  readonly disposables: DisposableScope;
  /** Event subscriptions made here are torn down automatically on deactivate. */
  readonly events: EventScope<TChannel>;
}

/** A GameFeature module: a named unit of feature behavior. */
export interface GameFeatureModule<TWorld extends object = object, TChannel extends EventChannel = string> {
  readonly name: string;
  activate(context: ActivationContext<TWorld, TChannel>): void;
  deactivate(): void;
}

export interface GameFeatureLifecycleOptions {
  /** Opaque generation/boot id, used with RebuildGuard for "rebuild once". */
  generation?: number;
}

interface ActiveModule<TWorld extends object, TChannel extends EventChannel> {
  module: GameFeatureModule<TWorld, TChannel>;
  context: ActivationContext<TWorld, TChannel>;
}

/**
 * Pure lifecycle state machine for a single GameFeature.
 */
export class GameFeatureLifecycle<TWorld extends object = object, TChannel extends EventChannel = string> {
  private readonly modules = new Map<string, GameFeatureModule<TWorld, TChannel>>();
  private readonly active = new Map<string, ActiveModule<TWorld, TChannel>>();
  private adapters: LifecycleAdapters<TWorld, TChannel> | null = null;
  private activeFlag = false;

  /** Opaque generation/boot id (see RebuildGuard). */
  readonly generation: number;

  constructor(options: GameFeatureLifecycleOptions = {}) {
    this.generation = options.generation ?? 0;
  }

  /** Whether the feature is currently activated. */
  get isActive(): boolean {
    return this.activeFlag;
  }

  /** Number of registered (non-unregistered) modules. */
  get moduleCount(): number {
    return this.modules.size;
  }

  /** Number of modules currently in the activated state. */
  get activeModuleCount(): number {
    return this.active.size;
  }

  /**
   * Register a module. Idempotent per module name — registering the same name
   * twice is a no-op and never double-activates. If the feature is already
   * active, the module's activation state is replayed immediately.
   */
  register(module: GameFeatureModule<TWorld, TChannel>): void {
    if (this.modules.has(module.name)) {
      return;
    }
    this.modules.set(module.name, module);
    if (this.activeFlag && this.adapters) {
      this.activateModule(module, this.adapters);
    }
  }

  /**
   * Unregister a module by reference or name. If it is currently activated it
   * is deactivated (symmetrically released) first.
   */
  unregister(moduleOrName: GameFeatureModule<TWorld, TChannel> | string): void {
    const name = typeof moduleOrName === "string" ? moduleOrName : moduleOrName.name;
    if (this.active.has(name)) {
      this.deactivateModule(name);
    }
    this.modules.delete(name);
  }

  /**
   * Activate the feature with the given adapters. Idempotent — calling again
   * while already active is a no-op. Activate is called on every registered
   * module in registration order.
   */
  activate(adapters: LifecycleAdapters<TWorld, TChannel>): void {
    if (this.activeFlag) {
      return;
    }
    this.activeFlag = true;
    this.adapters = adapters;
    for (const module of this.modules.values()) {
      this.activateModule(module, adapters);
    }
  }

  /**
   * Deactivate the feature. Idempotent — calling again while not active is a
   * no-op. Modules are deactivated in reverse activation order (symmetric:
   * FIFO activate / LIFO deactivate). Each module's deactivate() runs first,
   * then its timers are cancelled, disposables are released (LIFO) and event
   * subscriptions are torn down.
   */
  deactivate(): void {
    if (!this.activeFlag) {
      return;
    }
    this.activeFlag = false;
    this.adapters = null;
    // Reverse activation order => symmetric (FIFO activate / LIFO deactivate).
    const names = [...this.active.keys()];
    for (let i = names.length - 1; i >= 0; i--) {
      this.deactivateModule(names[i]);
    }
  }

  private activateModule(
    module: GameFeatureModule<TWorld, TChannel>,
    adapters: LifecycleAdapters<TWorld, TChannel>,
  ): void {
    if (this.active.has(module.name)) {
      return;
    }
    const context = this.createContext(adapters);
    this.active.set(module.name, { module, context });
    try {
      module.activate(context);
    } catch (error) {
      console.error(`[GameFeatureLifecycle] activate('${module.name}') threw:`, error);
    }
  }

  private deactivateModule(name: string): void {
    const entry = this.active.get(name);
    if (!entry) {
      return;
    }
    this.active.delete(name);
    const { module, context } = entry;
    try {
      module.deactivate();
    } catch (error) {
      console.error(`[GameFeatureLifecycle] deactivate('${module.name}') threw:`, error);
    }
    // Symmetric release of everything created during activate().
    context.timers.cancelAll();
    context.disposables.dispose();
    context.events.clear();
  }

  private createContext(adapters: LifecycleAdapters<TWorld, TChannel>): ActivationContext<TWorld, TChannel> {
    const worldRef = adapters.createWorldRef
      ? adapters.createWorldRef(adapters.world)
      : createWorldRef(adapters.world);
    return {
      world: worldRef,
      timers: new TimerScope({
        createTimer: (delay, callback, repeating) => adapters.createTimer(delay, callback, repeating),
      }),
      disposables: new DisposableScope(),
      events: new EventScope<TChannel>({
        subscribe: (channel, handler) => adapters.subscribeEvent(channel, handler),
      }),
    };
  }
}

/**
 * Rebuild guard — "rebuild exactly once per VM generation".
 *
 * A PuerTS FJsEnv restart destroys all JS state, so the GameFeature must be
 * reconstructed by the new VM's bootstrap. If that bootstrap code runs more
 * than once (defensive re-entry, duplicate registration), this guard ensures
 * only the first build request of a generation is honored.
 *
 * Pure logic — testable without UE.
 */
export class RebuildGuard {
  private generation = 0;
  private builtGeneration: number | null = null;

  /** Current VM generation id. */
  get currentGeneration(): number {
    return this.generation;
  }

  /**
   * Called by the bootstrap when a (new) VM starts. Returns the new
   * generation id. In a real integration the id can be sourced from a
   * UE-side counter that survives VM restarts; here it is simply bumped.
   */
  markVmStart(): number {
    this.generation++;
    return this.generation;
  }

  /**
   * Claim the right to build for the current generation. Returns true only
   * once per generation; subsequent calls in the same generation return false.
   */
  beginBuild(): boolean {
    if (this.builtGeneration === this.generation) {
      return false;
    }
    this.builtGeneration = this.generation;
    return true;
  }

  /** Reset to a fresh state (mainly for tests). */
  reset(): void {
    this.generation = 0;
    this.builtGeneration = null;
  }
}
