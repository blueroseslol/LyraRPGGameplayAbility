/**
 * TimerScope — tracks timers created during a single activation so they can
 * all be cancelled on deactivate.
 *
 * Actual timer creation is delegated to an injected `TimerFactory` (a thin
 * adapter over the UE timer system), keeping this module pure and testable
 * under plain Node.
 */

/** Handle to a live timer. Calling cancel() stops it. */
export interface TimerHandle {
  readonly id: number;
  cancel(): void;
}

/** Adapter over the host timer system (UE KismetSystemLibrary / Latent etc.). */
export interface TimerFactory {
  createTimer(delaySeconds: number, callback: () => void, repeating?: boolean): TimerHandle;
}

const NOOP_TIMER: TimerHandle = { id: -1, cancel: () => {} };

export class TimerScope {
  private readonly factory: TimerFactory;
  private readonly handles = new Map<number, TimerHandle>();
  private nextId = 1;

  constructor(factory: TimerFactory) {
    this.factory = factory;
  }

  /** Number of live (not-yet-cancelled) timers tracked by this scope. */
  get size(): number {
    return this.handles.size;
  }

  /**
   * Create a timer through the injected factory and track it. It is cancelled
   * automatically by cancelAll() (i.e. on deactivate). Returns a no-op handle
   * if the factory throws.
   */
  set(delaySeconds: number, callback: () => void, repeating = false): TimerHandle {
    const id = this.nextId++;
    let underlying: TimerHandle;
    try {
      underlying = this.factory.createTimer(delaySeconds, callback, repeating);
    } catch (error) {
      console.error("[TimerScope] factory.createTimer threw:", error);
      return NOOP_TIMER;
    }
    this.handles.set(id, underlying);
    return {
      id,
      cancel: () => {
        this.cancel(id);
      },
    };
  }

  /** Cancel one tracked timer by id. No-op if unknown/already cancelled. */
  cancel(id: number): void {
    const handle = this.handles.get(id);
    if (!handle) {
      return;
    }
    this.handles.delete(id);
    try {
      handle.cancel();
    } catch (error) {
      console.error("[TimerScope] cancel threw:", error);
    }
  }

  /** Cancel every timer created through this scope. Idempotent. */
  cancelAll(): void {
    for (const handle of this.handles.values()) {
      try {
        handle.cancel();
      } catch (error) {
        console.error("[TimerScope] cancelAll threw:", error);
      }
    }
    this.handles.clear();
  }
}
