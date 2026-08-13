---
name: utilities
description: "Skill for the Utilities area of LyraRPGGameplayAbility. 41 symbols across 9 files."
---

# Utilities

41 symbols | 9 files | Cohesion: 100%

## When to Use

- Working with code in `Plugins/`
- Understanding how BEFORE_EACH, CheckMeshDataForProblem, CheckChaosMeshCollision work
- Modifying utilities-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `Plugins/GameFeatures/ShooterTests/Source/ShooterTestsRuntime/Private/Utilities/ShooterTestsNetworkComponent.h` | PrepareAndWaitForServerPlayerSpawn, PrepareAndWaitForClientPlayerSpawn, HasWorldLoaded, HasValidLocalPlayer, FetchLocalPlayer (+9) |
| `Plugins/GameFeatures/ShooterTests/Source/ShooterTestsRuntime/Private/Utilities/ShooterTestsActorTest.h` | GetExpectedAnimation, TestInputActionAnimation, HasWorldLoaded, PreparePlayerPawn, IsPlayerPawnFullySpawned (+2) |
| `Plugins/GameFeatures/ShooterTests/Source/ShooterTestsRuntime/Private/Utilities/ShooterTestsInputTestHelper.cpp` | MoveForward, MoveBackward, StrafeLeft, StrafeRight, RotateLeft (+2) |
| `Plugins/GameFeatures/ShooterTests/Source/ShooterTestsRuntime/Private/Utilities/ShooterTestsActorNetworkTest.h` | FetchAnimationAssetForServerPlayer, FetchAnimationAssetForClientPlayer, IsServerPlayerAnimationPlayingOnAllClients, IsClientPlayerAnimationPlayingOnAllClients |
| `Plugins/GameFeatures/ShooterTests/Source/ShooterTestsRuntime/Private/Utilities/ShooterTestsAnimationTestHelper.h` | FindAnimationAsset, IsAnimationPlaying |
| `Plugins/GameFeatures/ShooterTests/Source/ShooterTestsRuntime/Private/Utilities/ShooterTestsActorTestHelper.h` | FShooterTestsActorTestHelper, FShooterTestsActorInputTestHelper |
| `Plugins/GameFeatures/ShooterTests/Source/ShooterTestsRuntime/Private/Utilities/ShooterTestsAnimationTestHelper.cpp` | IsExpectedAnimationPlaying, IsAnimationPlaying |
| `Source/LyraEditor/Utilities/CheckChaosMeshCollision.cpp` | CheckMeshDataForProblem, CheckChaosMeshCollision |
| `Plugins/GameFeatures/ShooterTests/Source/ShooterTestsRuntime/Private/ShooterTestsActorAnimationTests.cpp` | BEFORE_EACH |

## Entry Points

Start here when exploring this area:

- **`BEFORE_EACH`** (Function) — `Plugins/GameFeatures/ShooterTests/Source/ShooterTestsRuntime/Private/ShooterTestsActorAnimationTests.cpp:45`
- **`CheckMeshDataForProblem`** (Function) — `Source/LyraEditor/Utilities/CheckChaosMeshCollision.cpp:16`
- **`CheckChaosMeshCollision`** (Function) — `Source/LyraEditor/Utilities/CheckChaosMeshCollision.cpp:53`
- **`FShooterTestsActorTestHelper`** (Class) — `Plugins/GameFeatures/ShooterTests/Source/ShooterTestsRuntime/Private/Utilities/ShooterTestsActorTestHelper.h:11`
- **`FShooterTestsActorInputTestHelper`** (Class) — `Plugins/GameFeatures/ShooterTests/Source/ShooterTestsRuntime/Private/Utilities/ShooterTestsActorTestHelper.h:61`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `FShooterTestsActorTestHelper` | Class | `Plugins/GameFeatures/ShooterTests/Source/ShooterTestsRuntime/Private/Utilities/ShooterTestsActorTestHelper.h` | 11 |
| `FShooterTestsActorInputTestHelper` | Class | `Plugins/GameFeatures/ShooterTests/Source/ShooterTestsRuntime/Private/Utilities/ShooterTestsActorTestHelper.h` | 61 |
| `BEFORE_EACH` | Function | `Plugins/GameFeatures/ShooterTests/Source/ShooterTestsRuntime/Private/ShooterTestsActorAnimationTests.cpp` | 45 |
| `CheckMeshDataForProblem` | Function | `Source/LyraEditor/Utilities/CheckChaosMeshCollision.cpp` | 16 |
| `CheckChaosMeshCollision` | Function | `Source/LyraEditor/Utilities/CheckChaosMeshCollision.cpp` | 53 |
| `FetchAnimationAssetForServerPlayer` | Method | `Plugins/GameFeatures/ShooterTests/Source/ShooterTestsRuntime/Private/Utilities/ShooterTestsActorNetworkTest.h` | 100 |
| `FetchAnimationAssetForClientPlayer` | Method | `Plugins/GameFeatures/ShooterTests/Source/ShooterTestsRuntime/Private/Utilities/ShooterTestsActorNetworkTest.h` | 124 |
| `IsServerPlayerAnimationPlayingOnAllClients` | Method | `Plugins/GameFeatures/ShooterTests/Source/ShooterTestsRuntime/Private/Utilities/ShooterTestsActorNetworkTest.h` | 182 |
| `IsClientPlayerAnimationPlayingOnAllClients` | Method | `Plugins/GameFeatures/ShooterTests/Source/ShooterTestsRuntime/Private/Utilities/ShooterTestsActorNetworkTest.h` | 194 |
| `GetExpectedAnimation` | Method | `Plugins/GameFeatures/ShooterTests/Source/ShooterTestsRuntime/Private/Utilities/ShooterTestsActorTest.h` | 179 |
| `TestInputActionAnimation` | Method | `Plugins/GameFeatures/ShooterTests/Source/ShooterTestsRuntime/Private/Utilities/ShooterTestsActorTest.h` | 191 |
| `FindAnimationAsset` | Method | `Plugins/GameFeatures/ShooterTests/Source/ShooterTestsRuntime/Private/Utilities/ShooterTestsAnimationTestHelper.h` | 50 |
| `IsAnimationPlaying` | Method | `Plugins/GameFeatures/ShooterTests/Source/ShooterTestsRuntime/Private/Utilities/ShooterTestsAnimationTestHelper.h` | 60 |
| `MoveForward` | Method | `Plugins/GameFeatures/ShooterTests/Source/ShooterTestsRuntime/Private/Utilities/ShooterTestsInputTestHelper.cpp` | 19 |
| `MoveBackward` | Method | `Plugins/GameFeatures/ShooterTests/Source/ShooterTestsRuntime/Private/Utilities/ShooterTestsInputTestHelper.cpp` | 24 |
| `StrafeLeft` | Method | `Plugins/GameFeatures/ShooterTests/Source/ShooterTestsRuntime/Private/Utilities/ShooterTestsInputTestHelper.cpp` | 29 |
| `StrafeRight` | Method | `Plugins/GameFeatures/ShooterTests/Source/ShooterTestsRuntime/Private/Utilities/ShooterTestsInputTestHelper.cpp` | 34 |
| `RotateLeft` | Method | `Plugins/GameFeatures/ShooterTests/Source/ShooterTestsRuntime/Private/Utilities/ShooterTestsInputTestHelper.cpp` | 39 |
| `RotateRight` | Method | `Plugins/GameFeatures/ShooterTests/Source/ShooterTestsRuntime/Private/Utilities/ShooterTestsInputTestHelper.cpp` | 44 |
| `PerformAxisAction` | Method | `Plugins/GameFeatures/ShooterTests/Source/ShooterTestsRuntime/Private/Utilities/ShooterTestsInputTestHelper.cpp` | 49 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `TestInputActionAnimation → FindAnimationAsset` | intra_community | 3 |

## How to Explore

1. `context({name: "BEFORE_EACH"})` — see callers and callees
2. `query({search_query: "utilities"})` — find related execution flows
3. Read key files listed above for implementation details
4. `explain({target: "<file or symbol>"})` — persisted taint findings (source→sink data flows), when indexed with `--pdg`
