---
name: character
description: "Skill for the Character area of LyraRPGGameplayAbility. 76 symbols across 12 files."
---

# Character

76 symbols | 12 files | Cohesion: 84%

## When to Use

- Working with code in `Source/`
- Understanding how OnRegister, CanChangeInitState, HandleChangeInitState work
- Modifying character-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `Source/LyraGame/Character/LyraCharacter.cpp` | NotifyControllerChanged, PossessedBy, UnPossessed, SetGenericTeamId, GetGenericTeamId (+20) |
| `Source/LyraGame/Character/LyraHeroComponent.cpp` | OnRegister, CanChangeInitState, HandleChangeInitState, InitializePlayerInput, AddAdditionalInputConfig (+8) |
| `Source/LyraGame/Character/LyraPawnExtensionComponent.cpp` | OnRegister, CanChangeInitState, BeginPlay, SetPawnData, OnRep_PawnData (+8) |
| `Source/LyraGame/Character/LyraHealthComponent.cpp` | OnUnregister, InitializeWithAbilitySystem, UninitializeFromAbilitySystem, ClearGameplayTags, OnRep_DeathState (+2) |
| `Source/LyraGame/Character/LyraPawn.cpp` | PossessedBy, UnPossessed, SetGenericTeamId, GetGenericTeamId, OnRep_MyTeamID |
| `Source/LyraGame/Player/LyraPlayerState.cpp` | ClientInitialize, PostInitializeComponents, SetGenericTeamId, OnRep_MyTeamID |
| `Source/LyraGame/Equipment/LyraEquipmentInstance.cpp` | GetWorld, GetPawn, SpawnEquipmentActors |
| `Source/LyraGame/Player/LyraPlayerBotController.cpp` | ServerRestartController, OnUnPossess |
| `Source/LyraGame/Player/LyraPlayerController.cpp` | OnUnPossess |
| `Source/LyraGame/Weapons/LyraWeaponInstance.cpp` | ULyraWeaponInstance |

## Entry Points

Start here when exploring this area:

- **`OnRegister`** (Method) — `Source/LyraGame/Character/LyraHeroComponent.cpp:46`
- **`CanChangeInitState`** (Method) — `Source/LyraGame/Character/LyraHeroComponent.cpp:75`
- **`HandleChangeInitState`** (Method) — `Source/LyraGame/Character/LyraHeroComponent.cpp:144`
- **`InitializePlayerInput`** (Method) — `Source/LyraGame/Character/LyraHeroComponent.cpp:224`
- **`AddAdditionalInputConfig`** (Method) — `Source/LyraGame/Character/LyraHeroComponent.cpp:303`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `OnRegister` | Method | `Source/LyraGame/Character/LyraHeroComponent.cpp` | 46 |
| `CanChangeInitState` | Method | `Source/LyraGame/Character/LyraHeroComponent.cpp` | 75 |
| `HandleChangeInitState` | Method | `Source/LyraGame/Character/LyraHeroComponent.cpp` | 144 |
| `InitializePlayerInput` | Method | `Source/LyraGame/Character/LyraHeroComponent.cpp` | 224 |
| `AddAdditionalInputConfig` | Method | `Source/LyraGame/Character/LyraHeroComponent.cpp` | 303 |
| `Input_AbilityInputTagPressed` | Method | `Source/LyraGame/Character/LyraHeroComponent.cpp` | 342 |
| `Input_AbilityInputTagReleased` | Method | `Source/LyraGame/Character/LyraHeroComponent.cpp` | 356 |
| `Input_Move` | Method | `Source/LyraGame/Character/LyraHeroComponent.cpp` | 373 |
| `Input_LookMouse` | Method | `Source/LyraGame/Character/LyraHeroComponent.cpp` | 403 |
| `Input_LookStick` | Method | `Source/LyraGame/Character/LyraHeroComponent.cpp` | 425 |
| `Input_Crouch` | Method | `Source/LyraGame/Character/LyraHeroComponent.cpp` | 450 |
| `Input_AutoRun` | Method | `Source/LyraGame/Character/LyraHeroComponent.cpp` | 458 |
| `DetermineCameraMode` | Method | `Source/LyraGame/Character/LyraHeroComponent.cpp` | 470 |
| `OnRegister` | Method | `Source/LyraGame/Character/LyraPawnExtensionComponent.cpp` | 40 |
| `CanChangeInitState` | Method | `Source/LyraGame/Character/LyraPawnExtensionComponent.cpp` | 223 |
| `GetWorld` | Method | `Source/LyraGame/Equipment/LyraEquipmentInstance.cpp` | 22 |
| `GetPawn` | Method | `Source/LyraGame/Equipment/LyraEquipmentInstance.cpp` | 50 |
| `SpawnEquipmentActors` | Method | `Source/LyraGame/Equipment/LyraEquipmentInstance.cpp` | 68 |
| `ServerRestartController` | Method | `Source/LyraGame/Player/LyraPlayerBotController.cpp` | 103 |
| `OnUnPossess` | Method | `Source/LyraGame/Player/LyraPlayerBotController.cpp` | 165 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `OnAbilitySystemInitialized → GetAbilitySystemComponent` | intra_community | 5 |
| `BeginPlay → GetPawn` | cross_community | 5 |
| `ClearCheatParts → GetPawn` | cross_community | 5 |
| `ProcessAbilityInput → GetAbilitySystemComponent` | cross_community | 4 |
| `HandleChangeInitState → Reset` | cross_community | 4 |
| `Reset → GetAbilitySystemComponent` | cross_community | 4 |
| `AddCheatPart → GetPawn` | cross_community | 4 |
| `Tick → GetPawn` | cross_community | 3 |
| `HandleChangeInitState → GetPawn` | intra_community | 3 |
| `InitializeAbilitySystem → Reset` | cross_community | 3 |

## Connected Areas

| Area | Connections |
|------|-------------|
| GameFeatures | 6 calls |
| Attributes | 5 calls |
| Teams | 1 calls |
| GameModes | 1 calls |

## How to Explore

1. `context({name: "OnRegister"})` — see callers and callees
2. `query({search_query: "character"})` — find related execution flows
3. Read key files listed above for implementation details
4. `explain({target: "<file or symbol>"})` — persisted taint findings (source→sink data flows), when indexed with `--pdg`
