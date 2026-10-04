// Preserve Puerts' lazy UE namespace; __importStar copies only already-loaded types.
import UE = require('ue');

function equal(actual: unknown, expected: unknown, reason: string): void {
    if (actual !== expected) throw new Error(`${reason}: expected ${expected}, actual ${actual}`);
}

/** Calls real Lyra C++ inventory methods through Puerts, with a fresh UObject per test. */
export function inventoryStacks(forceFailure = false): void {
    const item = new UE.LyraInventoryItemInstance();
    const ammo = new UE.GameplayTag('Lyra.Test.Inventory.Ammo');
    const other = new UE.GameplayTag('Lyra.Test.Inventory.Other');
    equal(item.GetStatTagStackCount(ammo), forceFailure ? 1 : 0, 'New inventory is empty');
    item.AddStatTagStack(ammo, 3);
    item.AddStatTagStack(ammo, 2);
    equal(item.GetStatTagStackCount(ammo), 5, 'Stacks accumulate');
    item.AddStatTagStack(ammo, 0);
    item.AddStatTagStack(ammo, -1);
    equal(item.GetStatTagStackCount(ammo), 5, 'Nonpositive additions are ignored');
    item.AddStatTagStack(other, 2);
    item.RemoveStatTagStack(ammo, 2);
    equal(item.GetStatTagStackCount(ammo), 3, 'Partial removal');
    item.RemoveStatTagStack(ammo, 99);
    equal(item.GetStatTagStackCount(ammo), 0, 'Over-removal clamps to empty');
    equal(item.HasStatTag(ammo), false, 'Empty tag removed');
    equal(item.GetStatTagStackCount(other), 2, 'Other tag remains independent');
    item.RemoveStatTagStack(other, 2);
}
