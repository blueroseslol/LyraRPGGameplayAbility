/**
 * GameFeature 脚本生命周期 —— 纯净、不依赖 UE 的核心。
 *
 * 所有接触 UE 的依赖（World、定时器、事件）都以注入的 `LifecycleAdapters`
 * 形式在激活时传入。此处的状态机只关心已注册模块与激活状态，因此可以在
 * 没有 Unreal 运行时的情况下于纯 Node 中测试。
 *
 * 保证：
 *  - Register/Unregister 按模块名幂等。
 *  - Activate()/Deactivate() 幂等。
 *  - 功能已激活后才注册的模块会立即重放其激活状态。
 *  - Deactivate() 对称释放 Activate() 创建的一切：先执行模块自身的
 *    Deactivate()，再取消定时器，然后按 LIFO 释放 Disposable，最后拆除事件。
 */
import { DisposableScope } from "./Scopes/DisposableScope";
import { TimerScope } from "./Scopes/TimerScope";
import type { TimerHandle } from "./Scopes/TimerScope";
import { EventScope } from "./Scopes/EventScope";
import type { EventChannel, EventSubscription } from "./Scopes/EventScope";
import { CreateWorldRef } from "./Scopes/WeakRef";
import type { WorldRef } from "./Scopes/WeakRef";

/** 激活时注入的适配器集合（由 UE 侧 bootstrap 创建）。 */
export interface LifecycleAdapters<TWorld extends object = object, TChannel extends EventChannel = string> {
  /** 本次激活作用域对应的世界。只以弱引用形式交给模块。 */
  World: TWorld;
  /** 创建真实定时器；返回的句柄可取消它。 */
  CreateTimer(DelaySeconds: number, Callback: () => void, Repeating?: boolean): TimerHandle;
  /** 订阅真实事件频道；返回的句柄可取消订阅。 */
  SubscribeEvent(Channel: TChannel, Handler: (Payload: unknown) => void): EventSubscription;
  /** 可选的弱世界引用构建覆盖。 */
  CreateWorldRef?(World: TWorld): WorldRef<TWorld>;
}

/** 每模块的激活上下文 —— 模块唯一可以持有的东西。 */
export interface ActivationContext<TWorld extends object = object, TChannel extends EventChannel = string> {
  /** 对世界的弱引用（绝不是世界本身 —— 避免泄漏）。 */
  readonly World: WorldRef<TWorld>;
  /** 在此创建的定时器会在停用时自动取消。 */
  readonly Timers: TimerScope;
  /** 在此注册的清理回调在停用时按 LIFO 运行。 */
  readonly Disposables: DisposableScope;
  /** 在此建立的事件订阅会在停用时自动拆除。 */
  readonly Events: EventScope<TChannel>;
}

/** 一个 GameFeature 模块：一个命名的功能行为单元。 */
export interface GameFeatureModule<TWorld extends object = object, TChannel extends EventChannel = string> {
  readonly Name: string;
  Activate(Context: ActivationContext<TWorld, TChannel>): void;
  Deactivate(): void;
}

export interface GameFeatureLifecycleOptions {
  /** 不透明的代数/启动 id，与 RebuildGuard 配合实现「只重建一次」。 */
  Generation?: number;
}

interface ActiveModule<TWorld extends object, TChannel extends EventChannel> {
  Module: GameFeatureModule<TWorld, TChannel>;
  Context: ActivationContext<TWorld, TChannel>;
}

/**
 * 单个 GameFeature 的纯生命周期状态机。
 */
export class GameFeatureLifecycle<TWorld extends object = object, TChannel extends EventChannel = string> {
  private readonly Modules = new Map<string, GameFeatureModule<TWorld, TChannel>>();
  private readonly Active = new Map<string, ActiveModule<TWorld, TChannel>>();
  private Adapters: LifecycleAdapters<TWorld, TChannel> | null = null;
  private ActiveFlag = false;

  /** 不透明的代数/启动 id（见 RebuildGuard）。 */
  readonly Generation: number;

  constructor(Options: GameFeatureLifecycleOptions = {}) {
    this.Generation = Options.Generation ?? 0;
  }

  /** 功能当前是否已激活。 */
  get IsActive(): boolean {
    return this.ActiveFlag;
  }

  /** 已注册（未注销）的模块数量。 */
  get ModuleCount(): number {
    return this.Modules.size;
  }

  /** 当前处于激活状态的模块数量。 */
  get ActiveModuleCount(): number {
    return this.Active.size;
  }

  /**
   * 注册一个模块。按模块名幂等 —— 重复注册同名模块为 no-op，绝不会
   * 双重激活。若功能已激活，则该模块的激活状态会立即重放。
   */
  Register(Module: GameFeatureModule<TWorld, TChannel>): void {
    if (this.Modules.has(Module.Name)) {
      return;
    }
    this.Modules.set(Module.Name, Module);
    if (this.ActiveFlag && this.Adapters) {
      this.ActivateModule(Module, this.Adapters);
    }
  }

  /**
   * 按引用或名字注销一个模块。若它当前已激活，会先（对称）释放。
   */
  Unregister(ModuleOrName: GameFeatureModule<TWorld, TChannel> | string): void {
    const Name = typeof ModuleOrName === "string" ? ModuleOrName : ModuleOrName.Name;
    if (this.Active.has(Name)) {
      this.DeactivateModule(Name);
    }
    this.Modules.delete(Name);
  }

  /**
   * 用给定适配器激活功能。幂等 —— 已激活时再次调用为 no-op。
   * 会对每个已注册模块按注册顺序调用 Activate。
   */
  Activate(Adapters: LifecycleAdapters<TWorld, TChannel>): void {
    if (this.ActiveFlag) {
      return;
    }
    this.ActiveFlag = true;
    this.Adapters = Adapters;
    for (const Module of this.Modules.values()) {
      this.ActivateModule(Module, Adapters);
    }
  }

  /**
   * 停用功能。幂等 —— 未激活时再次调用为 no-op。
   * 模块按激活顺序的逆序停用（对称：FIFO 激活 / LIFO 停用）。
   * 每个模块先运行自己的 Deactivate()，然后取消定时器、按 LIFO 释放
   * Disposable，最后拆除事件订阅。
   */
  Deactivate(): void {
    if (!this.ActiveFlag) {
      return;
    }
    this.ActiveFlag = false;
    this.Adapters = null;
    // 逆激活顺序 => 对称（FIFO 激活 / LIFO 停用）。
    const Names = [...this.Active.keys()];
    for (let i = Names.length - 1; i >= 0; i--) {
      this.DeactivateModule(Names[i]);
    }
  }

  private ActivateModule(
    Module: GameFeatureModule<TWorld, TChannel>,
    Adapters: LifecycleAdapters<TWorld, TChannel>,
  ): void {
    if (this.Active.has(Module.Name)) {
      return;
    }
    const Context = this.CreateContext(Adapters);
    this.Active.set(Module.Name, { Module, Context });
    try {
      Module.Activate(Context);
    } catch (Exception) {
      console.error(`[GameFeatureLifecycle] Activate('${Module.Name}') threw:`, Exception);
    }
  }

  private DeactivateModule(Name: string): void {
    const Entry = this.Active.get(Name);
    if (!Entry) {
      return;
    }
    this.Active.delete(Name);
    const { Module, Context } = Entry;
    try {
      Module.Deactivate();
    } catch (Exception) {
      console.error(`[GameFeatureLifecycle] Deactivate('${Module.Name}') threw:`, Exception);
    }
    // 对称释放 Activate() 期间创建的一切。
    Context.Timers.CancelAll();
    Context.Disposables.Dispose();
    Context.Events.Clear();
  }

  private CreateContext(Adapters: LifecycleAdapters<TWorld, TChannel>): ActivationContext<TWorld, TChannel> {
    const WorldRef = Adapters.CreateWorldRef
      ? Adapters.CreateWorldRef(Adapters.World)
      : CreateWorldRef(Adapters.World);
    return {
      World: WorldRef,
      Timers: new TimerScope({
        CreateTimer: (Delay, Callback, Repeating) => Adapters.CreateTimer(Delay, Callback, Repeating),
      }),
      Disposables: new DisposableScope(),
      Events: new EventScope<TChannel>({
        Subscribe: (Channel, Handler) => Adapters.SubscribeEvent(Channel, Handler),
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
  private Generation = 0;
  private BuiltGeneration: number | null = null;

  /** 当前 VM 代数 id。 */
  get CurrentGeneration(): number {
    return this.Generation;
  }

  /**
   * 由 bootstrap 在（新）VM 启动时调用。返回新的代数 id。
   * 真实集成中该 id 可取自 UE 侧在 VM 重启后仍然存活的计数器；
   * 这里简单递增。
   */
  MarkVmStart(): number {
    this.Generation++;
    return this.Generation;
  }

  /**
   * 申领当前代数的构建权。每个代数只返回一次 true；
   * 同一代数内的后续调用返回 false。
   */
  BeginBuild(): boolean {
    if (this.BuiltGeneration === this.Generation) {
      return false;
    }
    this.BuiltGeneration = this.Generation;
    return true;
  }

  /** 重置到全新状态（主要用于测试）。 */
  Reset(): void {
    this.Generation = 0;
    this.BuiltGeneration = null;
  }
}
