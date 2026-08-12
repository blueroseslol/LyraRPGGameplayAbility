/**
 * TimerScope —— 跟踪单次激活期间创建的定时器，以便在停用时统一取消。
 *
 * 实际创建定时器的逻辑委托给注入的 `TimerFactory`（对 UE 定时器系统的
 * 薄封装），使本模块保持纯净、可在纯 Node 下测试。
 */

/** 指向一个活跃定时器的句柄。调用 cancel() 停止它。 */
export interface TimerHandle {
  readonly id: number;
  cancel(): void;
}

/** 对宿主导航定时器系统（UE KismetSystemLibrary / Latent 等）的适配器。 */
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

  /** 本作用域跟踪的活跃（尚未取消）定时器数量。 */
  get size(): number {
    return this.handles.size;
  }

  /**
   * 通过注入的工厂创建定时器并跟踪它。它会由 cancelAll()（即停用时）
   * 自动取消。若工厂抛异常则返回一个 no-op 句柄。
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

  /** 按 id 取消一个已跟踪的定时器。未知/已取消时为 no-op。 */
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

  /** 取消本作用域创建的所有定时器。幂等。 */
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
