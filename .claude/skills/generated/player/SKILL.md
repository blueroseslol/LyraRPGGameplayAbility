---
name: player
description: "Skill for the Player area of LyraRPGGameplayAbility. 91 symbols across 24 files."
---

# Player

91 symbols | 24 files | Cohesion: 88%

## When to Use

- Working with code in `Source/`
- Understanding how IntegerToGenericTeamId, UpdatingViewTargetGuard, AModularAIController work
- Modifying player-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `Source/LyraGame/Player/LyraCheatManager.cpp` | CancelActivatedAbilities, AddTagToSelf, RemoveTagFromSelf, DamageSelf, DamageTarget (+17) |
| `Source/LyraGame/Player/LyraPlayerController.cpp` | OnPlayerStateChangedTeam, PlayerTick, GetLyraPlayerState, GetLyraAbilitySystemComponent, OnRep_PlayerState (+16) |
| `Source/LyraGame/Player/LyraPlayerBotController.cpp` | OnPlayerStateChanged, BroadcastOnPlayerStateChanged, InitPlayerState, CleanupPlayerState, OnRep_PlayerState (+3) |
| `Source/LyraGame/Player/LyraLocalPlayer.cpp` | OnControllerChangedTeam, SwitchController, SpawnPlayActor, InitOnlineSession, OnPlayerControllerChanged (+3) |
| `Source/LyraGame/Player/LyraPlayerState.cpp` | OnDeactivated, OnReactivated, SetPlayerConnectionType, OnExperienceLoaded, SetPawnData |
| `Source/LyraGame/Player/LyraPlayerStart.cpp` | GetLocationOccupancy, CheckUnclaimed, IsClaimed, TryClaim |
| `Source/LyraGame/Player/LyraPlayerSpawningManagerComponent.cpp` | ChoosePlayerStart, FindPlayFromHereStart, GetFirstRandomUnoccupiedPlayerStart |
| `Source/LyraGame/Player/LyraPlayerController.h` | ALyraPlayerController, ALyraReplayPlayerController |
| `Source/LyraGame/Teams/LyraTeamAgentInterface.h` | ILyraTeamAgentInterface, IntegerToGenericTeamId |
| `Source/LyraGame/Camera/LyraUICameraManagerComponent.cpp` | SetViewTarget, UpdatingViewTargetGuard |

## Entry Points

Start here when exploring this area:

- **`IntegerToGenericTeamId`** (Function) — `Source/LyraGame/Teams/LyraTeamAgentInterface.h:21`
- **`UpdatingViewTargetGuard`** (Function) — `Source/LyraGame/Camera/LyraUICameraManagerComponent.cpp:47`
- **`AModularAIController`** (Class) — `Plugins/ModularGameplayActors/Source/ModularGameplayActors/Public/ModularAIController.h:14`
- **`AModularCharacter`** (Class) — `Plugins/ModularGameplayActors/Source/ModularGameplayActors/Public/ModularCharacter.h:14`
- **`AModularPawn`** (Class) — `Plugins/ModularGameplayActors/Source/ModularGameplayActors/Public/ModularPawn.h:14`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `AModularAIController` | Class | `Plugins/ModularGameplayActors/Source/ModularGameplayActors/Public/ModularAIController.h` | 14 |
| `AModularCharacter` | Class | `Plugins/ModularGameplayActors/Source/ModularGameplayActors/Public/ModularCharacter.h` | 14 |
| `AModularPawn` | Class | `Plugins/ModularGameplayActors/Source/ModularGameplayActors/Public/ModularPawn.h` | 14 |
| `AModularPlayerState` | Class | `Plugins/ModularGameplayActors/Source/ModularGameplayActors/Public/ModularPlayerState.h` | 16 |
| `ILyraCameraAssistInterface` | Class | `Source/LyraGame/Camera/LyraCameraAssistInterface.h` | 16 |
| `ALyraCharacter` | Class | `Source/LyraGame/Character/LyraCharacter.h` | 97 |
| `ALyraPawn` | Class | `Source/LyraGame/Character/LyraPawn.h` | 19 |
| `ULyraLocalPlayer` | Class | `Source/LyraGame/Player/LyraLocalPlayer.h` | 26 |
| `ALyraPlayerBotController` | Class | `Source/LyraGame/Player/LyraPlayerBotController.h` | 23 |
| `ALyraPlayerController` | Class | `Source/LyraGame/Player/LyraPlayerController.h` | 32 |
| `ALyraReplayPlayerController` | Class | `Source/LyraGame/Player/LyraPlayerController.h` | 147 |
| `ALyraPlayerState` | Class | `Source/LyraGame/Player/LyraPlayerState.h` | 50 |
| `ILyraTeamAgentInterface` | Class | `Source/LyraGame/Teams/LyraTeamAgentInterface.h` | 33 |
| `IntegerToGenericTeamId` | Function | `Source/LyraGame/Teams/LyraTeamAgentInterface.h` | 21 |
| `UpdatingViewTargetGuard` | Function | `Source/LyraGame/Camera/LyraUICameraManagerComponent.cpp` | 47 |
| `CancelActivatedAbilities` | Method | `Source/LyraGame/Player/LyraCheatManager.cpp` | 231 |
| `AddTagToSelf` | Method | `Source/LyraGame/Player/LyraCheatManager.cpp` | 240 |
| `RemoveTagFromSelf` | Method | `Source/LyraGame/Player/LyraCheatManager.cpp` | 256 |
| `DamageSelf` | Method | `Source/LyraGame/Player/LyraCheatManager.cpp` | 272 |
| `DamageTarget` | Method | `Source/LyraGame/Player/LyraCheatManager.cpp` | 280 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `ChoosePlayerStart → Reset` | cross_community | 4 |
| `PlayerTick → GetLyraPlayerState` | intra_community | 4 |
| `OnControllerChangedTeam → GenericTeamIdToInteger` | cross_community | 3 |
| `OnControllerChangedTeam → GetClientServerContextString` | cross_community | 3 |
| `OnControllerChangedTeam → GenericTeamIdToInteger` | cross_community | 3 |
| `OnControllerChangedTeam → GetClientServerContextString` | cross_community | 3 |
| `OnControllerChangedTeam → GenericTeamIdToInteger` | cross_community | 3 |
| `OnControllerChangedTeam → GetClientServerContextString` | cross_community | 3 |
| `OnPlayerStateChangedTeam → GenericTeamIdToInteger` | cross_community | 3 |
| `OnPlayerStateChangedTeam → GetClientServerContextString` | cross_community | 3 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Character | 10 calls |
| GameFeatures | 1 calls |

## How to Explore

1. `context({name: "IntegerToGenericTeamId"})` — see callers and callees
2. `query({search_query: "player"})` — find related execution flows
3. Read key files listed above for implementation details
4. `explain({target: "<file or symbol>"})` — persisted taint findings (source→sink data flows), when indexed with `--pdg`
