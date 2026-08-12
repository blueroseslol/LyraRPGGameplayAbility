/**
 * TimerScope —— 跟踪单次激活期间创建的定时器，以便在停用时统一取消。
 *
 * 实际创建定时器的逻辑委托给注入的 `TimerFactory`（对 UE 定时器系统的
 * 薄封装），使本模块保持纯净、可在纯 Node 下测试。
 */

/** 指向一个活跃定时器的句柄。调用 Cancel() 停止它。 */
export interface TimerHandle {
  readonly Id: number;
  Cancel(): void;
}

/** 对宿主导航定时器系统（UE KismetSystemLibrary / Latent 等）的适配器。 */
export interface TimerFactory {
  CreateTimer(DelaySeconds: number, Callback: () => void, Repeating?: boolean): TimerHandle;
}

const NOOP_TIMER: TimerHandle = { Id: -1, Cancel: () => {} };

export class TimerScope {
  private readonly Factory: TimerFactory;
  private readonly Handles = new Map<number, TimerHandle>();
  private NextId = 1;

  constructor(Factory: TimerFactory) {
    this.Factory = Factory;
  }

  /** 本作用域跟踪的活跃（尚未取消）定时器数量。 */
  get Size(): number {
    return this.Handles.size;
  }

  /**
   * 通过注入的工厂创建定时器并跟踪它。它会由 CancelAll()（即停用时）
   * 自动取消。若工厂抛异常则返回一个 no-op 句柄。
   */
  Set(DelaySeconds: number, Callback: () => void, Repeating = false): TimerHandle {
    const Id = this.NextId++;
    let Underlying: TimerHandle;
    try {
      Underlying = this.Factory.CreateTimer(DelaySeconds, Callback, Repeating);
    } catch (Exception) {
      console.error("[TimerScope] Factory.CreateTimer threw:", Exception);
      return NOOP_TIMER;
    }
    this.Handles.set(Id, Underlying);
    return {
      Id,
      Cancel: () => {
        this.Cancel(Id);
      },
    };
  }

  /** 按 Id 取消一个已跟踪的定时器。未知/已取消时为 no-op。 */
  Cancel(Id: number): void {
    const Handle = this.Handles.get(Id);
    if (!Handle) {
      return;
    }
    this.Handles.delete(Id);
    try {
      Handle.Cancel();
    } catch (Exception) {
      console.error("[TimerScope] Cancel threw:", Exception);
    }
  }

  /** 取消本作用域创建的所有定时器。幂等。 */
  CancelAll(): void {
    for (const Handle of this.Handles.values()) {
      try {
        Handle.Cancel();
      } catch (Exception) {
        console.error("[TimerScope] CancelAll threw:", Exception);
      }
    }
    this.Handles.clear();
  }
}
