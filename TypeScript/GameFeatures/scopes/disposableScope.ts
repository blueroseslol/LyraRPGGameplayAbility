/**
 * DisposableScope —— LIFO「释放委托」作用域。
 *
 * `activate()` 内注册的清理回调会按逆序（LIFO）在功能停用时执行，
 * 从而对激活期间创建的一切资源做对称释放。
 *
 * 纯逻辑 —— 无 UE 依赖，可在纯 Node 下单元测试。
 */

export type Disposer = () => void;

const NOOP = (): void => {};

/** 一个按 LIFO 顺序、仅运行一次已注册 disposer 的作用域。 */
export class DisposableScope {
  private readonly callbacks: Disposer[] = [];
  private disposedFlag = false;

  /** dispose() 已执行后为 true。 */
  get disposed(): boolean {
    return this.disposedFlag;
  }

  /** 尚未释放的回调数量。 */
  get size(): number {
    return this.callbacks.length;
  }

  /**
   * 注册一个清理回调。返回一个一次性 disposer：可提前执行该回调并把它从
   * 作用域中移除（幂等）。若作用域已 dispose，回调会立即执行。
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
   * 按 LIFO 顺序运行所有已注册回调，然后清空作用域。
   * 幂等 —— 后续调用为 no-op。
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
