/**
 * GameFeature 脚本生命周期 —— 纯净、不依赖 UE 的核心。
 *
 * 所有接触 UE 的依赖（world、定时器、事件）都以注入的 `LifecycleAdapters`
 * 形式在激活时传入。此处的状态机只关心已注册模块与激活状态，因此可以在
 * 没有 Unreal 运行时的情况下于纯 Node 中测试。
 *
 * 保证：
 *  - register/unregister 按模块名幂等。
 *  - activate()/deactivate() 幂等。
 *  - 功能已激活后才注册的模块会立即重放其激活状态。
 *  - deactivate() 对称释放 activate() 创建的一切：先执行模块自身的
 *    deactivate()，再取消定时器，然后按 LIFO 释放 disposable，最后拆除事件。
 */
import { DisposableScope } from "./scopes/disposableScope";
import { TimerScope } from "./scopes/timerScope";
import type { TimerHandle } from "./scopes/timerScope";
import { EventScope } from "./scopes/eventScope";
import type { EventChannel, EventSubscription } from "./scopes/eventScope";
import { createWorldRef } from "./scopes/weakRef";
import type { WorldRef } from "./scopes/weakRef";

/** 激活时注入的适配器集合（由 UE 侧 bootstrap 创建）。 */
export interface LifecycleAdapters<TWorld extends object = object, TChannel extends EventChannel = string> {
  /** 本次激活作用域对应的世界。只以弱引用形式交给模块。 */
  world: TWorld;
  /** 创建真实定时器；返回的句柄可取消它。 */
  createTimer(delaySeconds: number, callback: () => void, repeating?: boolean): TimerHandle;
  /** 订阅真实事件频道；返回的句柄可取消订阅。 */
  subscribeEvent(channel: TChannel, handler: (payload: unknown) => void): EventSubscription;
  /** 可选的弱世界引用构建覆盖。 */
  createWorldRef?(world: TWorld): WorldRef<TWorld>;
}

/** 每模块的激活上下文 —— 模块唯一可以持有的东西。 */
export interface ActivationContext<TWorld extends object = object, TChannel extends EventChannel = string> {
  /** 对世界的弱引用（绝不是世界本身 —— 避免泄漏）。 */
  readonly world: WorldRef<TWorld>;
  /** 在此创建的定时器会在停用时自动取消。 */
  readonly timers: TimerScope;
  /** 在此注册的清理回调在停用时按 LIFO 运行。 */
  readonly disposables: DisposableScope;
  /** 在此建立的事件订阅会在停用时自动拆除。 */
  readonly events: EventScope<TChannel>;
}

/** 一个 GameFeature 模块：一个命名的功能行为单元。 */
export interface GameFeatureModule<TWorld extends object = object, TChannel extends EventChannel = string> {
  readonly name: string;
  activate(context: ActivationContext<TWorld, TChannel>): void;
  deactivate(): void;
}

export interface GameFeatureLifecycleOptions {
  /** 不透明的代数/启动 id，与 RebuildGuard 配合实现「只重建一次」。 */
  generation?: number;
}

interface ActiveModule<TWorld extends object, TChannel extends EventChannel> {
  module: GameFeatureModule<TWorld, TChannel>;
  context: ActivationContext<TWorld, TChannel>;
}

/**
 * 单个 GameFeature 的纯生命周期状态机。
 */
export class GameFeatureLifecycle<TWorld extends object = object, TChannel extends EventChannel = string> {
  private readonly modules = new Map<string, GameFeatureModule<TWorld, TChannel>>();
  private readonly active = new Map<string, ActiveModule<TWorld, TChannel>>();
  private adapters: LifecycleAdapters<TWorld, TChannel> | null = null;
  private activeFlag = false;

  /** 不透明的代数/启动 id（见 RebuildGuard）。 */
  readonly generation: number;

  constructor(options: GameFeatureLifecycleOptions = {}) {
    this.generation = options.generation ?? 0;
  }

  /** 功能当前是否已激活。 */
  get isActive(): boolean {
    return this.activeFlag;
  }

  /** 已注册（未注销）的模块数量。 */
  get moduleCount(): number {
    return this.modules.size;
  }

  /** 当前处于激活状态的模块数量。 */
  get activeModuleCount(): number {
    return this.active.size;
  }

  /**
   * 注册一个模块。按模块名幂等 —— 重复注册同名模块为 no-op，绝不会
   * 双重激活。若功能已激活，则该模块的激活状态会立即重放。
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
   * 按引用或名字注销一个模块。若它当前已激活，会先（对称）释放。
   */
  unregister(moduleOrName: GameFeatureModule<TWorld, TChannel> | string): void {
    const name = typeof moduleOrName === "string" ? moduleOrName : moduleOrName.name;
    if (this.active.has(name)) {
      this.deactivateModule(name);
    }
    this.modules.delete(name);
  }

  /**
   * 用给定适配器激活功能。幂等 —— 已激活时再次调用为 no-op。
   * 会对每个已注册模块按注册顺序调用 activate。
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
   * 停用功能。幂等 —— 未激活时再次调用为 no-op。
   * 模块按激活顺序的逆序停用（对称：FIFO 激活 / LIFO 停用）。
   * 每个模块先运行自己的 deactivate()，然后取消定时器、按 LIFO 释放
   * disposable，最后拆除事件订阅。
   */
  deactivate(): void {
    if (!this.activeFlag) {
      return;
    }
    this.activeFlag = false;
    this.adapters = null;
    // 逆激活顺序 => 对称（FIFO 激活 / LIFO 停用）。
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
    // 对称释放 activate() 期间创建的一切。
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
 * 重建保护 ——「每个 VM 代数只重建一次」。
 *
 * PuerTS 的 FJsEnv 重启会销毁所有 JS 状态，因此 GameFeature 必须由新 VM 的
 * bootstrap 重建。若该 bootstrap 代码被执行超过一次（防御性重入、重复注册），
 * 本保护确保同一代数内只认可第一次构建请求。
 *
 * 纯逻辑 —— 无 UE 依赖，可测试。
 */
export class RebuildGuard {
  private generation = 0;
  private builtGeneration: number | null = null;

  /** 当前 VM 代数 id。 */
  get currentGeneration(): number {
    return this.generation;
  }

  /**
   * 由 bootstrap 在（新）VM 启动时调用。返回新的代数 id。
   * 真实集成中该 id 可取自 UE 侧在 VM 重启后仍然存活的计数器；
   * 这里简单递增。
   */
  markVmStart(): number {
    this.generation++;
    return this.generation;
  }

  /**
   * 申领当前代数的构建权。每个代数只返回一次 true；
   * 同一代数内的后续调用返回 false。
   */
  beginBuild(): boolean {
    if (this.builtGeneration === this.generation) {
      return false;
    }
    this.builtGeneration = this.generation;
    return true;
  }

  /** 重置到全新状态（主要用于测试）。 */
  reset(): void {
    this.generation = 0;
    this.builtGeneration = null;
  }
}
