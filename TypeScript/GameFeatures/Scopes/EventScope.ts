/**
 * EventScope —— 跟踪单次激活期间的事件订阅，以便在停用时统一取消订阅。
 *
 * 订阅逻辑委托给注入的 `EventSubscriber` 适配器（对 UE 委托系统的封装），
 * 使本模块保持纯净、可在纯 Node 下测试。
 */

/** 指向一个活跃事件订阅的句柄。Unsubscribe() 拆除它。 */
export interface EventSubscription {
  readonly Id: number;
  Unsubscribe(): void;
}

/** 频道标识 —— UE 侧为字符串（FName），这里保持抽象。 */
export type EventChannel = string | number | symbol;

/** 对宿主事件系统（UE 多播委托 / 信号）的适配器。 */
export interface EventSubscriber<TChannel extends EventChannel = EventChannel> {
  Subscribe(Channel: TChannel, Handler: (Payload: unknown) => void): EventSubscription;
}

const NOOP_SUBSCRIPTION: EventSubscription = { Id: -1, Unsubscribe: () => {} };

export class EventScope<TChannel extends EventChannel = EventChannel> {
  private readonly Subscriber: EventSubscriber<TChannel>;
  private readonly Subscriptions = new Map<number, EventSubscription>();
  private NextId = 1;

  constructor(Subscriber: EventSubscriber<TChannel>) {
    this.Subscriber = Subscriber;
  }

  /** 此处跟踪的活跃（尚未取消订阅）订阅数量。 */
  get Size(): number {
    return this.Subscriptions.size;
  }

  /**
   * 订阅一个事件并跟踪它。它会由 Clear()（即停用时）自动拆除。
   * 若订阅器抛异常则返回一个 no-op 订阅。
   */
  On(Channel: TChannel, Handler: (Payload: unknown) => void): EventSubscription {
    let Underlying: EventSubscription;
    try {
      Underlying = this.Subscriber.Subscribe(Channel, Handler);
    } catch (Exception) {
      console.error("[EventScope] Subscriber.Subscribe threw:", Exception);
      return NOOP_SUBSCRIPTION;
    }
    const Id = this.NextId++;
    this.Subscriptions.set(Id, Underlying);
    return {
      Id,
      Unsubscribe: () => {
        this.Unsubscribe(Id);
      },
    };
  }

  /** 按 Id 取消一个已跟踪的订阅。未知/已移除时为 no-op。 */
  Unsubscribe(Id: number): void {
    const Sub = this.Subscriptions.get(Id);
    if (!Sub) {
      return;
    }
    this.Subscriptions.delete(Id);
    try {
      Sub.Unsubscribe();
    } catch (Exception) {
      console.error("[EventScope] Unsubscribe threw:", Exception);
    }
  }

  /** 取消本作用域跟踪的所有订阅。幂等。 */
  Clear(): void {
    for (const Sub of this.Subscriptions.values()) {
      try {
        Sub.Unsubscribe();
      } catch (Exception) {
        console.error("[EventScope] Clear threw:", Exception);
      }
    }
    this.Subscriptions.clear();
  }
}
