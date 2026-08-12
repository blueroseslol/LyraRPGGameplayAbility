/**
 * EventScope —— 跟踪单次激活期间的事件订阅，以便在停用时统一取消订阅。
 *
 * 订阅逻辑委托给注入的 `EventSubscriber` 适配器（对 UE 委托系统的封装），
 * 使本模块保持纯净、可在纯 Node 下测试。
 */

/** 指向一个活跃事件订阅的句柄。unsubscribe() 拆除它。 */
export interface EventSubscription {
  readonly id: number;
  unsubscribe(): void;
}

/** 频道标识 —— UE 侧为字符串（FName），这里保持抽象。 */
export type EventChannel = string | number | symbol;

/** 对宿主事件系统（UE 多播委托 / 信号）的适配器。 */
export interface EventSubscriber<TChannel extends EventChannel = EventChannel> {
  subscribe(channel: TChannel, handler: (payload: unknown) => void): EventSubscription;
}

const NOOP_SUBSCRIPTION: EventSubscription = { id: -1, unsubscribe: () => {} };

export class EventScope<TChannel extends EventChannel = EventChannel> {
  private readonly subscriber: EventSubscriber<TChannel>;
  private readonly subscriptions = new Map<number, EventSubscription>();
  private nextId = 1;

  constructor(subscriber: EventSubscriber<TChannel>) {
    this.subscriber = subscriber;
  }

  /** 此处跟踪的活跃（尚未取消订阅）订阅数量。 */
  get size(): number {
    return this.subscriptions.size;
  }

  /**
   * 订阅一个事件并跟踪它。它会由 clear()（即停用时）自动拆除。
   * 若订阅器抛异常则返回一个 no-op 订阅。
   */
  on(channel: TChannel, handler: (payload: unknown) => void): EventSubscription {
    let underlying: EventSubscription;
    try {
      underlying = this.subscriber.subscribe(channel, handler);
    } catch (error) {
      console.error("[EventScope] subscriber.subscribe threw:", error);
      return NOOP_SUBSCRIPTION;
    }
    const id = this.nextId++;
    this.subscriptions.set(id, underlying);
    return {
      id,
      unsubscribe: () => {
        this.unsubscribe(id);
      },
    };
  }

  /** 按 id 取消一个已跟踪的订阅。未知/已移除时为 no-op。 */
  unsubscribe(id: number): void {
    const sub = this.subscriptions.get(id);
    if (!sub) {
      return;
    }
    this.subscriptions.delete(id);
    try {
      sub.unsubscribe();
    } catch (error) {
      console.error("[EventScope] unsubscribe threw:", error);
    }
  }

  /** 取消本作用域跟踪的所有订阅。幂等。 */
  clear(): void {
    for (const sub of this.subscriptions.values()) {
      try {
        sub.unsubscribe();
      } catch (error) {
        console.error("[EventScope] clear threw:", error);
      }
    }
    this.subscriptions.clear();
  }
}
