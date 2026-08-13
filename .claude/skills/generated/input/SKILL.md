---
name: input
description: "Skill for the Input area of LyraRPGGameplayAbility. 36 symbols across 7 files."
---

# Input

36 symbols | 7 files | Cohesion: 88%

## When to Use

- Working with code in `Plugins/`
- Understanding how FindTarget, TargetScreenBounds, Box2D work
- Modifying input-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `Plugins/GameFeatures/ShooterCore/Source/ShooterCoreRuntime/Private/Input/AimAssistInputModifier.cpp` | UpdateViewData, ResetViewData, GetLookRates, ModifyRaw_Implementation, UpdateRotationalVelocity (+12) |
| `Plugins/GameFeatures/ShooterCore/Source/ShooterCoreRuntime/Private/Input/AimAssistTargetManagerComponent.cpp` | FindTarget, GatherTargetInfo, TargetScreenBounds, DoesTargetPassFilter, GetVisibleTargets (+4) |
| `Source/LyraGame/Input/LyraPlayerInput.cpp` | ~ULyraPlayerInput, UnbindLatencyMarkerSettingChangeListener, InputKey, ProcessInputEventForLatencyMarker |
| `Plugins/GameFeatures/ShooterCore/Source/ShooterCoreRuntime/Public/Input/AimAssistInputModifier.h` | ProjectShapeToScreen, ProjectReticleToScreen |
| `Plugins/GameFeatures/ShooterCore/Source/ShooterCoreRuntime/Public/Input/AimAssistTargetManagerComponent.h` | GetVisibleTargets, GetFOVScale |
| `Plugins/GameFeatures/ShooterCore/Source/ShooterCoreRuntime/Public/Input/AimAssistTargetComponent.h` | UAimAssistTargetComponent |
| `Plugins/GameFeatures/ShooterCore/Source/ShooterCoreRuntime/Public/Input/IAimAssistTargetInterface.h` | IAimAssistTaget |

## Entry Points

Start here when exploring this area:

- **`FindTarget`** (Function) — `Plugins/GameFeatures/ShooterCore/Source/ShooterCoreRuntime/Private/Input/AimAssistTargetManagerComponent.cpp:30`
- **`TargetScreenBounds`** (Function) — `Plugins/GameFeatures/ShooterCore/Source/ShooterCoreRuntime/Private/Input/AimAssistTargetManagerComponent.cpp:205`
- **`Box2D`** (Function) — `Plugins/GameFeatures/ShooterCore/Source/ShooterCoreRuntime/Private/Input/AimAssistInputModifier.cpp:260`
- **`RotationalVelocity`** (Function) — `Plugins/GameFeatures/ShooterCore/Source/ShooterCoreRuntime/Private/Input/AimAssistInputModifier.cpp:607`
- **`Params`** (Function) — `Plugins/GameFeatures/ShooterCore/Source/ShooterCoreRuntime/Private/Input/AimAssistTargetManagerComponent.cpp:130`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `UAimAssistTargetComponent` | Class | `Plugins/GameFeatures/ShooterCore/Source/ShooterCoreRuntime/Public/Input/AimAssistTargetComponent.h` | 18 |
| `IAimAssistTaget` | Class | `Plugins/GameFeatures/ShooterCore/Source/ShooterCoreRuntime/Public/Input/IAimAssistTargetInterface.h` | 49 |
| `FindTarget` | Function | `Plugins/GameFeatures/ShooterCore/Source/ShooterCoreRuntime/Private/Input/AimAssistTargetManagerComponent.cpp` | 30 |
| `TargetScreenBounds` | Function | `Plugins/GameFeatures/ShooterCore/Source/ShooterCoreRuntime/Private/Input/AimAssistTargetManagerComponent.cpp` | 205 |
| `Box2D` | Function | `Plugins/GameFeatures/ShooterCore/Source/ShooterCoreRuntime/Private/Input/AimAssistInputModifier.cpp` | 260 |
| `RotationalVelocity` | Function | `Plugins/GameFeatures/ShooterCore/Source/ShooterCoreRuntime/Private/Input/AimAssistInputModifier.cpp` | 607 |
| `Params` | Function | `Plugins/GameFeatures/ShooterCore/Source/ShooterCoreRuntime/Private/Input/AimAssistTargetManagerComponent.cpp` | 130 |
| `UpdateViewData` | Method | `Plugins/GameFeatures/ShooterCore/Source/ShooterCoreRuntime/Private/Input/AimAssistInputModifier.cpp` | 173 |
| `ResetViewData` | Method | `Plugins/GameFeatures/ShooterCore/Source/ShooterCoreRuntime/Private/Input/AimAssistInputModifier.cpp` | 223 |
| `GetLookRates` | Method | `Plugins/GameFeatures/ShooterCore/Source/ShooterCoreRuntime/Private/Input/AimAssistInputModifier.cpp` | 426 |
| `ModifyRaw_Implementation` | Method | `Plugins/GameFeatures/ShooterCore/Source/ShooterCoreRuntime/Private/Input/AimAssistInputModifier.cpp` | 453 |
| `UpdateRotationalVelocity` | Method | `Plugins/GameFeatures/ShooterCore/Source/ShooterCoreRuntime/Private/Input/AimAssistInputModifier.cpp` | 605 |
| `DoesTargetPassFilter` | Method | `Plugins/GameFeatures/ShooterCore/Source/ShooterCoreRuntime/Private/Input/AimAssistTargetManagerComponent.cpp` | 279 |
| `ProjectShapeToScreen` | Method | `Plugins/GameFeatures/ShooterCore/Source/ShooterCoreRuntime/Public/Input/AimAssistInputModifier.h` | 40 |
| `GetTargetWeightForTime` | Method | `Plugins/GameFeatures/ShooterCore/Source/ShooterCoreRuntime/Private/Input/AimAssistInputModifier.cpp` | 145 |
| `GetTargetWeightMaxTime` | Method | `Plugins/GameFeatures/ShooterCore/Source/ShooterCoreRuntime/Private/Input/AimAssistInputModifier.cpp` | 155 |
| `UpdateTargetData` | Method | `Plugins/GameFeatures/ShooterCore/Source/ShooterCoreRuntime/Private/Input/AimAssistInputModifier.cpp` | 530 |
| `GetVisibleTargets` | Method | `Plugins/GameFeatures/ShooterCore/Source/ShooterCoreRuntime/Public/Input/AimAssistTargetManagerComponent.h` | 34 |
| `ProjectBoxToScreen` | Method | `Plugins/GameFeatures/ShooterCore/Source/ShooterCoreRuntime/Private/Input/AimAssistInputModifier.cpp` | 312 |
| `ProjectSphereToScreen` | Method | `Plugins/GameFeatures/ShooterCore/Source/ShooterCoreRuntime/Private/Input/AimAssistInputModifier.cpp` | 347 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `ModifyRaw_Implementation → Reset` | cross_community | 5 |
| `GetVisibleTargets → Reset` | cross_community | 4 |
| `ModifyRaw_Implementation → GetVisibleTargets` | cross_community | 3 |
| `ModifyRaw_Implementation → ResetViewData` | intra_community | 3 |

## Connected Areas

| Area | Connections |
|------|-------------|
| GameFeatures | 5 calls |

## How to Explore

1. `context({name: "FindTarget"})` — see callers and callees
2. `query({search_query: "input"})` — find related execution flows
3. Read key files listed above for implementation details
4. `explain({target: "<file or symbol>"})` — persisted taint findings (source→sink data flows), when indexed with `--pdg`
