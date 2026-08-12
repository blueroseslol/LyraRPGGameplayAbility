/**
 * EventScope — tracks event subscriptions made during a single activation so
 * they can all be unsubscribed on deactivate.
 *
 * Subscription is delegated to an injected `EventSubscriber` adapter over the
 * UE delegate system, keeping this module pure and testable under plain Node.
 */

/** Handle to a live event subscription. unsubscribe() tears it down. */
export interface EventSubscription {
  readonly id: number;
  unsubscribe(): void;
}

/** Channel identifier — a string (FName) on the UE side, but kept abstract. */
export type EventChannel = string | number | symbol;

/** Adapter over the host event system (UE multicast delegates / signals). */
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

  /** Number of live (not-yet-unsubscribed) subscriptions tracked here. */
  get size(): number {
    return this.subscriptions.size;
  }

  /**
   * Subscribe to an event and track it. It is torn down automatically by
   * clear() (i.e. on deactivate). Returns a no-op subscription if the
   * subscriber throws.
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

  /** Unsubscribe one tracked subscription by id. No-op if unknown/removed. */
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

  /** Unsubscribe everything tracked by this scope. Idempotent. */
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
