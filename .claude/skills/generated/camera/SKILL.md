---
name: camera
description: "Skill for the Camera area of LyraRPGGameplayAbility. 24 symbols across 4 files."
---

# Camera

24 symbols | 4 files | Cohesion: 96%

## When to Use

- Working with code in `Source/`
- Understanding how GetCameraPreventPenetrationTarget, GetCameraView, UpdateCameraModes work
- Modifying camera-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `Source/LyraGame/Camera/LyraCameraMode.cpp` | GetLyraCameraComponent, GetTargetActor, GetPivotLocation, GetPivotRotation, UpdateView (+9) |
| `Source/LyraGame/Camera/LyraCameraMode_ThirdPerson.cpp` | UpdateView, UpdateForTarget, UpdatePreventPenetration, PreventCameraPenetration, SetTargetCrouchOffset (+1) |
| `Source/LyraGame/Camera/LyraCameraComponent.cpp` | GetCameraView, UpdateCameraModes, DrawDebug |
| `Source/LyraGame/Camera/LyraCameraAssistInterface.h` | GetCameraPreventPenetrationTarget |

## Entry Points

Start here when exploring this area:

- **`GetCameraPreventPenetrationTarget`** (Method) — `Source/LyraGame/Camera/LyraCameraAssistInterface.h:33`
- **`GetCameraView`** (Method) — `Source/LyraGame/Camera/LyraCameraComponent.cpp:31`
- **`UpdateCameraModes`** (Method) — `Source/LyraGame/Camera/LyraCameraComponent.cpp:84`
- **`DrawDebug`** (Method) — `Source/LyraGame/Camera/LyraCameraComponent.cpp:100`
- **`GetLyraCameraComponent`** (Method) — `Source/LyraGame/Camera/LyraCameraMode.cpp:64`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `GetCameraPreventPenetrationTarget` | Method | `Source/LyraGame/Camera/LyraCameraAssistInterface.h` | 33 |
| `GetCameraView` | Method | `Source/LyraGame/Camera/LyraCameraComponent.cpp` | 31 |
| `UpdateCameraModes` | Method | `Source/LyraGame/Camera/LyraCameraComponent.cpp` | 84 |
| `DrawDebug` | Method | `Source/LyraGame/Camera/LyraCameraComponent.cpp` | 100 |
| `GetLyraCameraComponent` | Method | `Source/LyraGame/Camera/LyraCameraMode.cpp` | 64 |
| `GetTargetActor` | Method | `Source/LyraGame/Camera/LyraCameraMode.cpp` | 74 |
| `GetPivotLocation` | Method | `Source/LyraGame/Camera/LyraCameraMode.cpp` | 81 |
| `GetPivotRotation` | Method | `Source/LyraGame/Camera/LyraCameraMode.cpp` | 113 |
| `UpdateView` | Method | `Source/LyraGame/Camera/LyraCameraMode.cpp` | 132 |
| `UpdateView` | Method | `Source/LyraGame/Camera/LyraCameraMode_ThirdPerson.cpp` | 34 |
| `UpdateForTarget` | Method | `Source/LyraGame/Camera/LyraCameraMode_ThirdPerson.cpp` | 73 |
| `UpdatePreventPenetration` | Method | `Source/LyraGame/Camera/LyraCameraMode_ThirdPerson.cpp` | 110 |
| `PreventCameraPenetration` | Method | `Source/LyraGame/Camera/LyraCameraMode_ThirdPerson.cpp` | 172 |
| `SetTargetCrouchOffset` | Method | `Source/LyraGame/Camera/LyraCameraMode_ThirdPerson.cpp` | 351 |
| `UpdateCrouchOffset` | Method | `Source/LyraGame/Camera/LyraCameraMode_ThirdPerson.cpp` | 359 |
| `Blend` | Method | `Source/LyraGame/Camera/LyraCameraMode.cpp` | 24 |
| `UpdateCameraMode` | Method | `Source/LyraGame/Camera/LyraCameraMode.cpp` | 126 |
| `UpdateBlending` | Method | `Source/LyraGame/Camera/LyraCameraMode.cpp` | 176 |
| `EvaluateStack` | Method | `Source/LyraGame/Camera/LyraCameraMode.cpp` | 329 |
| `UpdateStack` | Method | `Source/LyraGame/Camera/LyraCameraMode.cpp` | 364 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `EvaluateStack → GetLyraCameraComponent` | cross_community | 7 |
| `UpdateView → GetLyraCameraComponent` | intra_community | 4 |
| `EvaluateStack → UpdateBlending` | intra_community | 4 |
| `UpdateView → SetTargetCrouchOffset` | intra_community | 3 |
| `EvaluateStack → Blend` | intra_community | 3 |

## How to Explore

1. `context({name: "GetCameraPreventPenetrationTarget"})` — see callers and callees
2. `query({search_query: "camera"})` — find related execution flows
3. Read key files listed above for implementation details
4. `explain({target: "<file or symbol>"})` — persisted taint findings (source→sink data flows), when indexed with `--pdg`
