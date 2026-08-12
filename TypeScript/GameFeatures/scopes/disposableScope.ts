/**
 * DisposableScope — a LIFO "release delegate" scope.
 *
 * Cleanup callbacks registered inside `activate()` are stored and run in
 * reverse order (LIFO) when the feature deactivates, giving symmetric release
 * of everything created during activation.
 *
 * Pure logic — no UE dependency. Safe to unit test under plain Node.
 */

export type Disposer = () => void;

const NOOP = (): void => {};

/** A scope that runs registered disposers once, in LIFO order. */
export class DisposableScope {
  private readonly callbacks: Disposer[] = [];
  private disposedFlag = false;

  /** True after dispose() has run. */
  get disposed(): boolean {
    return this.disposedFlag;
  }

  /** Number of not-yet-released callbacks. */
  get size(): number {
    return this.callbacks.length;
  }

  /**
   * Register a cleanup callback. Returns a one-shot disposer that runs this
   * callback early and removes it from the scope (idempotent). If the scope
   * has already been disposed, the callback runs immediately.
   */
  add(callback: Disposer): Disposer {
    if (this.disposedFlag) {
      callback();
      return NOOP;
    }
    this.callbacks.push(callback);
    let removed = false;
    return () => {
      if (removed || this.disposedFlag) {
        return;
      }
      removed = true;
      const index = this.callbacks.lastIndexOf(callback);
      if (index >= 0) {
        this.callbacks.splice(index, 1);
      }
      callback();
    };
  }

  /**
   * Run all registered callbacks in LIFO order, then clear the scope.
   * Idempotent — subsequent calls are no-ops.
   */
  dispose(): void {
    if (this.disposedFlag) {
      return;
    }
    this.disposedFlag = true;
    for (let i = this.callbacks.length - 1; i >= 0; i--) {
      const callback = this.callbacks[i];
      try {
        callback();
      } catch (error) {
        console.error("[DisposableScope] callback threw:", error);
      }
    }
    this.callbacks.length = 0;
  }
}
