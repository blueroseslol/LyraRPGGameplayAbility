/**
 * 弱世界引用支持。
 *
 * 生命周期只把 `WorldRef`（而非世界对象本身）交给模块，因此长寿模块
 * 不会因强持有 UWorld 而造成泄漏。若宿主运行时支持 `WeakRef`（ES2021+），
 * 该引用是真正弱引用；否则优雅降级、完全不保留世界对象。
 *
 * 纯逻辑 —— 无 UE 依赖。
 */

/** 对世界对象的弱（或不保留的）引用。 */
export interface WorldRef<TWorld extends object> {
  /** 返回被引用的世界对象；若已被垃圾回收则返回 null。 */
  Get(): TWorld | null;
}

const SupportsWeakRef =
  typeof WeakRef !== "undefined" && typeof FinalizationRegistry !== "undefined";

/**
 * 构建一个 WorldRef。优先使用真正的 `WeakRef`；在不支持 WeakRef 的运行时，
 * 返回一个不保留世界的引用（安全 —— 调用方必须把 `Get()` 返回 null 视为
 * 「世界已消失」）。
 */
export function CreateWorldRef<TWorld extends object>(World: TWorld): WorldRef<TWorld> {
  if (SupportsWeakRef) {
    const Ref = new WeakRef<TWorld>(World);
    return {
      Get(): TWorld | null {
        return Ref.deref() ?? null;
      },
    };
  }
  return {
    Get(): TWorld | null {
      return null;
    },
  };
}
