---
name: indicatorsystem
description: "Skill for the IndicatorSystem area of LyraRPGGameplayAbility. 41 symbols across 7 files."
---

# IndicatorSystem

41 symbols | 7 files | Cohesion: 91%

## When to Use

- Working with code in `Source/`
- Understanding how ClampRect, Project, GetSceneComponent work
- Modifying indicatorsystem-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `Source/LyraGame/UI/IndicatorSystem/IndicatorDescriptor.h` | Project, GetSceneComponent, GetIndicatorClass, CanAutomaticallyRemove, GetIsVisible (+14) |
| `Source/LyraGame/UI/IndicatorSystem/SActorCanvas.cpp` | UpdateCanvas, SetShowAnyIndicators, OnIndicatorAdded, AddIndicatorForEntry, OnArrangeChildren (+9) |
| `Source/LyraGame/UI/IndicatorSystem/SActorCanvas.h` | SetIsIndicatorVisible, SetInFrontOfCamera, SetHasValidScreenPosition, RefreshVisibility |
| `Source/LyraGame/UI/IndicatorSystem/IndicatorDescriptor.cpp` | Project |
| `Source/LyraGame/AbilitySystem/Abilities/LyraGameplayAbility.cpp` | GetLyraPlayerControllerFromActorInfo |
| `Source/LyraGame/Interaction/Abilities/LyraGameplayAbility_Interact.cpp` | UpdateInteractions |
| `Source/LyraGame/UI/IndicatorSystem/LyraIndicatorManagerComponent.cpp` | AddIndicator |

## Entry Points

Start here when exploring this area:

- **`ClampRect`** (Function) — `Source/LyraGame/UI/IndicatorSystem/SActorCanvas.cpp:370`
- **`Project`** (Method) — `Source/LyraGame/UI/IndicatorSystem/IndicatorDescriptor.h:20`
- **`GetSceneComponent`** (Method) — `Source/LyraGame/UI/IndicatorSystem/IndicatorDescriptor.h:52`
- **`GetIndicatorClass`** (Method) — `Source/LyraGame/UI/IndicatorSystem/IndicatorDescriptor.h:62`
- **`CanAutomaticallyRemove`** (Method) — `Source/LyraGame/UI/IndicatorSystem/IndicatorDescriptor.h:82`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `ClampRect` | Function | `Source/LyraGame/UI/IndicatorSystem/SActorCanvas.cpp` | 370 |
| `Project` | Method | `Source/LyraGame/UI/IndicatorSystem/IndicatorDescriptor.h` | 20 |
| `GetSceneComponent` | Method | `Source/LyraGame/UI/IndicatorSystem/IndicatorDescriptor.h` | 52 |
| `GetIndicatorClass` | Method | `Source/LyraGame/UI/IndicatorSystem/IndicatorDescriptor.h` | 62 |
| `CanAutomaticallyRemove` | Method | `Source/LyraGame/UI/IndicatorSystem/IndicatorDescriptor.h` | 82 |
| `GetIsVisible` | Method | `Source/LyraGame/UI/IndicatorSystem/IndicatorDescriptor.h` | 92 |
| `GetPriority` | Method | `Source/LyraGame/UI/IndicatorSystem/IndicatorDescriptor.h` | 177 |
| `UpdateCanvas` | Method | `Source/LyraGame/UI/IndicatorSystem/SActorCanvas.cpp` | 157 |
| `SetShowAnyIndicators` | Method | `Source/LyraGame/UI/IndicatorSystem/SActorCanvas.cpp` | 294 |
| `OnIndicatorAdded` | Method | `Source/LyraGame/UI/IndicatorSystem/SActorCanvas.cpp` | 545 |
| `AddIndicatorForEntry` | Method | `Source/LyraGame/UI/IndicatorSystem/SActorCanvas.cpp` | 561 |
| `Project` | Method | `Source/LyraGame/UI/IndicatorSystem/IndicatorDescriptor.cpp` | 10 |
| `GetComponentSocketName` | Method | `Source/LyraGame/UI/IndicatorSystem/IndicatorDescriptor.h` | 57 |
| `GetProjectionMode` | Method | `Source/LyraGame/UI/IndicatorSystem/IndicatorDescriptor.h` | 101 |
| `GetWorldPositionOffset` | Method | `Source/LyraGame/UI/IndicatorSystem/IndicatorDescriptor.h` | 146 |
| `GetScreenSpaceOffset` | Method | `Source/LyraGame/UI/IndicatorSystem/IndicatorDescriptor.h` | 155 |
| `GetBoundingBoxAnchor` | Method | `Source/LyraGame/UI/IndicatorSystem/IndicatorDescriptor.h` | 163 |
| `GetLyraPlayerControllerFromActorInfo` | Method | `Source/LyraGame/AbilitySystem/Abilities/LyraGameplayAbility.cpp` | 56 |
| `UpdateInteractions` | Method | `Source/LyraGame/Interaction/Abilities/LyraGameplayAbility_Interact.cpp` | 40 |
| `SetDataObject` | Method | `Source/LyraGame/UI/IndicatorSystem/IndicatorDescriptor.h` | 49 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `UpdateCanvas → GetSceneComponent` | intra_community | 3 |

## Connected Areas

| Area | Connections |
|------|-------------|
| UI | 1 calls |

## How to Explore

1. `context({name: "ClampRect"})` — see callers and callees
2. `query({search_query: "indicatorsystem"})` — find related execution flows
3. Read key files listed above for implementation details
4. `explain({target: "<file or symbol>"})` — persisted taint findings (source→sink data flows), when indexed with `--pdg`
