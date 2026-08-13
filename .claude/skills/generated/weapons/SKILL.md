---
name: weapons
description: "Skill for the Weapons area of LyraRPGGameplayAbility. 58 symbols across 12 files."
---

# Weapons

58 symbols | 12 files | Cohesion: 93%

## When to Use

- Working with code in `Source/`
- Understanding how ScopedPrediction, VRandConeNormalDistribution, TraceParams work
- Modifying weapons-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `Source/LyraGame/Weapons/LyraGameplayAbility_RangedWeapon.cpp` | GetWeaponTargetingSourceLocation, GetTargetingTransform, PerformLocalTargeting, OnTargetDataReadyCallback, ScopedPrediction (+12) |
| `Source/LyraGame/Weapons/LyraRangedWeaponInstance.cpp` | PostLoad, PostEditChangeProperty, UpdateDebugVisualization, OnEquipped, Tick (+5) |
| `Source/LyraGame/Weapons/LyraWeaponInstance.cpp` | OnEquipped, OnUnequipped, GetOwningUserId, ApplyDeviceProperties, RemoveDeviceProperties (+1) |
| `Source/LyraGame/Weapons/LyraWeaponSpawner.cpp` | AttemptPickUpWeapon_Implementation, StartCoolDown, ResetCoolDown, OnCoolDownTimerComplete, SetWeaponPickupVisibility (+1) |
| `Source/LyraGame/Weapons/LyraWeaponStateComponent.cpp` | ShouldUpdateDamageInstigatedTime, ClientConfirmTargetData_Implementation, UpdateDamageInstigatedTime, ActuallyUpdateDamageInstigatedTime, ShouldShowHitAsSuccess (+1) |
| `Source/LyraGame/Equipment/LyraGameplayAbility_FromEquipment.cpp` | GetAssociatedEquipment, GetAssociatedItem |
| `Source/LyraGame/UI/Weapons/CircumferenceMarkerWidget.cpp` | SynchronizeProperties, SetRadius |
| `Source/LyraGame/UI/Weapons/LyraReticleWidgetBase.cpp` | ComputeSpreadAngle, ComputeMaxScreenspaceSpreadRadius |
| `Source/LyraGame/UI/Weapons/LyraWeaponUserInterface.cpp` | NativeTick, RebuildWidgetFromWeapon |
| `Source/LyraGame/UI/Weapons/SCircumferenceMarkerWidget.cpp` | GetMarkerRenderTransform, OnPaint |

## Entry Points

Start here when exploring this area:

- **`ScopedPrediction`** (Function) — `Source/LyraGame/Weapons/LyraGameplayAbility_RangedWeapon.cpp:483`
- **`VRandConeNormalDistribution`** (Function) — `Source/LyraGame/Weapons/LyraGameplayAbility_RangedWeapon.cpp:44`
- **`TraceParams`** (Function) — `Source/LyraGame/Weapons/LyraGameplayAbility_RangedWeapon.cpp:146`
- **`PostLoad`** (Method) — `Source/LyraGame/Weapons/LyraRangedWeaponInstance.cpp:21`
- **`PostEditChangeProperty`** (Method) — `Source/LyraGame/Weapons/LyraRangedWeaponInstance.cpp:31`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `ScopedPrediction` | Function | `Source/LyraGame/Weapons/LyraGameplayAbility_RangedWeapon.cpp` | 483 |
| `VRandConeNormalDistribution` | Function | `Source/LyraGame/Weapons/LyraGameplayAbility_RangedWeapon.cpp` | 44 |
| `TraceParams` | Function | `Source/LyraGame/Weapons/LyraGameplayAbility_RangedWeapon.cpp` | 146 |
| `PostLoad` | Method | `Source/LyraGame/Weapons/LyraRangedWeaponInstance.cpp` | 21 |
| `PostEditChangeProperty` | Method | `Source/LyraGame/Weapons/LyraRangedWeaponInstance.cpp` | 31 |
| `UpdateDebugVisualization` | Method | `Source/LyraGame/Weapons/LyraRangedWeaponInstance.cpp` | 37 |
| `OnEquipped` | Method | `Source/LyraGame/Weapons/LyraRangedWeaponInstance.cpp` | 47 |
| `Tick` | Method | `Source/LyraGame/Weapons/LyraRangedWeaponInstance.cpp` | 72 |
| `ComputeHeatRange` | Method | `Source/LyraGame/Weapons/LyraRangedWeaponInstance.cpp` | 87 |
| `ComputeSpreadRange` | Method | `Source/LyraGame/Weapons/LyraRangedWeaponInstance.cpp` | 105 |
| `AddSpread` | Method | `Source/LyraGame/Weapons/LyraRangedWeaponInstance.cpp` | 110 |
| `UpdateSpread` | Method | `Source/LyraGame/Weapons/LyraRangedWeaponInstance.cpp` | 147 |
| `UpdateMultipliers` | Method | `Source/LyraGame/Weapons/LyraRangedWeaponInstance.cpp` | 165 |
| `GetControllerFromActorInfo` | Method | `Source/LyraGame/AbilitySystem/Abilities/LyraGameplayAbility.cpp` | 61 |
| `GetWeaponTargetingSourceLocation` | Method | `Source/LyraGame/Weapons/LyraGameplayAbility_RangedWeapon.cpp` | 192 |
| `GetTargetingTransform` | Method | `Source/LyraGame/Weapons/LyraGameplayAbility_RangedWeapon.cpp` | 208 |
| `PerformLocalTargeting` | Method | `Source/LyraGame/Weapons/LyraGameplayAbility_RangedWeapon.cpp` | 351 |
| `OnTargetDataReadyCallback` | Method | `Source/LyraGame/Weapons/LyraGameplayAbility_RangedWeapon.cpp` | 476 |
| `StartRangedWeaponTargeting` | Method | `Source/LyraGame/Weapons/LyraGameplayAbility_RangedWeapon.cpp` | 551 |
| `OnEquipped` | Method | `Source/LyraGame/Weapons/LyraWeaponInstance.cpp` | 35 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `StartRangedWeaponTargeting → FindFirstPawnHitResult` | cross_community | 5 |
| `StartRangedWeaponTargeting → WeaponTrace` | cross_community | 5 |
| `StartRangedWeaponTargeting → GetAssociatedEquipment` | cross_community | 4 |
| `StartRangedWeaponTargeting → GetWeaponTargetingSourceLocation` | intra_community | 4 |
| `StartRangedWeaponTargeting → VRandConeNormalDistribution` | cross_community | 4 |
| `Tick → ComputeSpreadRange` | intra_community | 3 |
| `Tick → GetPawn` | cross_community | 3 |
| `Tick → ComputeHeatRange` | intra_community | 3 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Character | 3 calls |

## How to Explore

1. `context({name: "ScopedPrediction"})` — see callers and callees
2. `query({search_query: "weapons"})` — find related execution flows
3. Read key files listed above for implementation details
4. `explain({target: "<file or symbol>"})` — persisted taint findings (source→sink data flows), when indexed with `--pdg`
