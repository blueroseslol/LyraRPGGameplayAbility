/**
 * Weak world reference support.
 *
 * The lifecycle only hands modules a `WorldRef` (never the world object
 * directly) so a long-lived module cannot leak a UWorld by holding it
 * strongly. If the host runtime supports `WeakRef` (ES2021+), the reference
 * is truly weak; otherwise we degrade gracefully and do not retain the world
 * at all.
 *
 * Pure logic — no UE dependency.
 */

/** A weak (or non-retaining) reference to a world object. */
export interface WorldRef<TWorld extends object> {
  /** Returns the referenced world, or null if it has been garbage collected. */
  get(): TWorld | null;
}

const supportsWeakRef =
  typeof WeakRef !== "undefined" && typeof FinalizationRegistry !== "undefined";

/**
 * Build a WorldRef. Prefers a true `WeakRef`; on runtimes without WeakRef it
 * returns a reference that does not retain the world (safe — callers must
 * treat a null `get()` as "world is gone").
 */
export function createWorldRef<TWorld extends object>(world: TWorld): WorldRef<TWorld> {
  if (supportsWeakRef) {
    const ref = new WeakRef<TWorld>(world);
    return {
      get(): TWorld | null {
        return ref.deref() ?? null;
      },
    };
  }
  return {
    get(): TWorld | null {
      return null;
    },
  };
}
