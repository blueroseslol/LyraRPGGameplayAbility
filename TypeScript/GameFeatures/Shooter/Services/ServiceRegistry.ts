/**
 * 极简服务容器 —— ShooterGame GameFeature 的「服务组装根」。
 *
 * Activate() 里把后续里程碑的服务挂进来（M4 传送协调器、M5 对局阶段协调器、
 * M9 UI Presenter 等）；停用时按注册顺序逆序释放，保证对称清理。
 *
 * 纯逻辑 —— 无 UE 依赖，可在纯 Node 下测试。
 */

/** 一个已注册的服务条目。 */
export interface ServiceEntry<T = unknown> {
  readonly Key: string;
  readonly Service: T;
  /** 释放该服务时执行的回调（可选）。 */
  readonly Dispose?: () => void;
}

/** 按注册键寻址的极简服务容器。 */
export class ServiceRegistry {
  private readonly Entries = new Map<string, ServiceEntry>();
  private DisposedFlag = false;

  /** 已注册（尚未释放）的服务数量。 */
  get Size(): number {
    return this.Entries.size;
  }

  /** Dispose() 已执行后为 true。 */
  get Disposed(): boolean {
    return this.DisposedFlag;
  }

  /**
   * 注册一个服务。重复键会先释放旧条目再覆盖。容器已释放时忽略并告警。
   */
  Register<T>(Key: string, Service: T, Dispose?: () => void): void {
    if (this.DisposedFlag) {
      console.warn(`[ServiceRegistry] 容器已释放，忽略注册 '${Key}'。`);
      return;
    }
    const Existing = this.Entries.get(Key);
    if (Existing) {
      console.warn(`[ServiceRegistry] 重复注册 '${Key}'，覆盖旧实例。`);
      this.SafeDispose(Existing);
    }
    this.Entries.set(Key, { Key, Service, Dispose });
  }

  /** 按键取服务；未注册返回 undefined。 */
  Get<T>(Key: string): T | undefined {
    return this.Entries.get(Key)?.Service as T | undefined;
  }

  /** 键是否已注册。 */
  Has(Key: string): boolean {
    return this.Entries.has(Key);
  }

  /**
   * 按注册顺序逆序释放所有服务并清空容器。幂等 —— 后续调用为 no-op。
   */
  Dispose(): void {
    if (this.DisposedFlag) {
      return;
    }
    this.DisposedFlag = true;
    for (const Entry of [...this.Entries.values()].reverse()) {
      this.SafeDispose(Entry);
    }
    this.Entries.clear();
  }

  private SafeDispose(Entry: ServiceEntry): void {
    try {
      Entry.Dispose?.();
    } catch (Exception) {
      console.error(`[ServiceRegistry] 释放服务 '${Entry.Key}' 时抛异常:`, Exception);
    }
  }
}
