/**
 * DisposableScope —— LIFO「释放委托」作用域。
 *
 * `Activate()` 内注册的清理回调会按逆序（LIFO）在功能停用时执行，
 * 从而对激活期间创建的一切资源做对称释放。
 *
 * 纯逻辑 —— 无 UE 依赖，可在纯 Node 下单元测试。
 */

export type Disposer = () => void;

const NOOP = (): void => {};

/** 一个按 LIFO 顺序、仅运行一次已注册 Disposer 的作用域。 */
export class DisposableScope {
  private readonly Callbacks: Disposer[] = [];
  private DisposedFlag = false;

  /** Dispose() 已执行后为 true。 */
  get Disposed(): boolean {
    return this.DisposedFlag;
  }

  /** 尚未释放的回调数量。 */
  get Size(): number {
    return this.Callbacks.length;
  }

  /**
   * 注册一个清理回调。返回一个一次性 Disposer：可提前执行该回调并把它从
   * 作用域中移除（幂等）。若作用域已 Dispose，回调会立即执行。
   */
  Add(Callback: Disposer): Disposer {
    if (this.DisposedFlag) {
      Callback();
      return NOOP;
    }
    this.Callbacks.push(Callback);
    let Removed = false;
    return () => {
      if (Removed || this.DisposedFlag) {
        return;
      }
      Removed = true;
      const Index = this.Callbacks.lastIndexOf(Callback);
      if (Index >= 0) {
        this.Callbacks.splice(Index, 1);
      }
      Callback();
    };
  }

  /**
   * 按 LIFO 顺序运行所有已注册回调，然后清空作用域。
   * 幂等 —— 后续调用为 no-op。
   */
  Dispose(): void {
    if (this.DisposedFlag) {
      return;
    }
    this.DisposedFlag = true;
    for (let i = this.Callbacks.length - 1; i >= 0; i--) {
      const Callback = this.Callbacks[i];
      try {
        Callback();
      } catch (Exception) {
        console.error("[DisposableScope] Callback threw:", Exception);
      }
    }
    this.Callbacks.length = 0;
  }
}
