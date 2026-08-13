---
name: gamemodes
description: "Skill for the GameModes area of LyraRPGGameplayAbility. 41 symbols across 8 files."
---

# GameModes

41 symbols | 8 files | Cohesion: 97%

## When to Use

- Working with code in `Source/`
- Understanding how GetClientServerContextString, ULyraBotCreationComponent, SetCurrentExperience work
- Modifying gamemodes-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `Source/LyraGame/GameModes/LyraExperienceManagerComponent.cpp` | SetCurrentExperience, OnRep_CurrentExperience, StartExperienceLoad, OnExperienceLoadComplete, OnGameFeaturePluginLoadComplete (+8) |
| `Source/LyraGame/GameModes/LyraGameMode.cpp` | GetPawnDataForController, IsExperienceLoaded, GetDefaultPawnClassForController_Implementation, SpawnDefaultPawnAtTransform_Implementation, HandleStartingNewPlayer_Implementation (+7) |
| `Source/LyraGame/GameModes/AsyncAction_ExperienceReady.cpp` | Activate, Step1_HandleGameStateSet, Step2_ListenToExperienceLoading, Step3_HandleExperienceLoaded, Step4_BroadcastReady |
| `Source/LyraGame/GameModes/LyraGameState.cpp` | RemovePlayerState, SeamlessTravelTransitionCheckpoint, SetRecorderPlayerState, OnRep_RecorderPlayerState |
| `Source/LyraGame/GameModes/LyraBotCreationComponent.h` | ULyraBotCreationComponent, SpawnOneBot, RemoveOneBot |
| `Source/LyraGame/GameModes/LyraBotCreationComponent.cpp` | CreateBotName, SpawnOneBot |
| `Source/LyraGame/LyraLogChannels.cpp` | GetClientServerContextString |
| `Plugins/CommonUser/Source/CommonUser/Public/CommonUserSubsystem.h` | TryToLoginForOnlinePlay |

## Entry Points

Start here when exploring this area:

- **`GetClientServerContextString`** (Function) — `Source/LyraGame/LyraLogChannels.cpp:10`
- **`ULyraBotCreationComponent`** (Class) — `Source/LyraGame/GameModes/LyraBotCreationComponent.h:13`
- **`SetCurrentExperience`** (Method) — `Source/LyraGame/GameModes/LyraExperienceManagerComponent.cpp:55`
- **`OnRep_CurrentExperience`** (Method) — `Source/LyraGame/GameModes/LyraExperienceManagerComponent.cpp:117`
- **`StartExperienceLoad`** (Method) — `Source/LyraGame/GameModes/LyraExperienceManagerComponent.cpp:122`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `ULyraBotCreationComponent` | Class | `Source/LyraGame/GameModes/LyraBotCreationComponent.h` | 13 |
| `GetClientServerContextString` | Function | `Source/LyraGame/LyraLogChannels.cpp` | 10 |
| `SetCurrentExperience` | Method | `Source/LyraGame/GameModes/LyraExperienceManagerComponent.cpp` | 55 |
| `OnRep_CurrentExperience` | Method | `Source/LyraGame/GameModes/LyraExperienceManagerComponent.cpp` | 117 |
| `StartExperienceLoad` | Method | `Source/LyraGame/GameModes/LyraExperienceManagerComponent.cpp` | 122 |
| `OnExperienceLoadComplete` | Method | `Source/LyraGame/GameModes/LyraExperienceManagerComponent.cpp` | 213 |
| `OnGameFeaturePluginLoadComplete` | Method | `Source/LyraGame/GameModes/LyraExperienceManagerComponent.cpp` | 277 |
| `OnExperienceFullLoadCompleted` | Method | `Source/LyraGame/GameModes/LyraExperienceManagerComponent.cpp` | 288 |
| `GetPawnDataForController` | Method | `Source/LyraGame/GameModes/LyraGameMode.cpp` | 44 |
| `IsExperienceLoaded` | Method | `Source/LyraGame/GameModes/LyraGameMode.cpp` | 322 |
| `GetDefaultPawnClassForController_Implementation` | Method | `Source/LyraGame/GameModes/LyraGameMode.cpp` | 331 |
| `SpawnDefaultPawnAtTransform_Implementation` | Method | `Source/LyraGame/GameModes/LyraGameMode.cpp` | 344 |
| `HandleStartingNewPlayer_Implementation` | Method | `Source/LyraGame/GameModes/LyraGameMode.cpp` | 390 |
| `TryToLoginForOnlinePlay` | Method | `Plugins/CommonUser/Source/CommonUser/Public/CommonUserSubsystem.h` | 300 |
| `HandleMatchAssignmentIfNotExpectingOne` | Method | `Source/LyraGame/GameModes/LyraGameMode.cpp` | 87 |
| `TryDedicatedServerLogin` | Method | `Source/LyraGame/GameModes/LyraGameMode.cpp` | 166 |
| `OnMatchAssignmentGiven` | Method | `Source/LyraGame/GameModes/LyraGameMode.cpp` | 288 |
| `CallOrRegister_OnExperienceLoaded_HighPriority` | Method | `Source/LyraGame/GameModes/LyraExperienceManagerComponent.cpp` | 69 |
| `CallOrRegister_OnExperienceLoaded` | Method | `Source/LyraGame/GameModes/LyraExperienceManagerComponent.cpp` | 81 |
| `CallOrRegister_OnExperienceLoaded_LowPriority` | Method | `Source/LyraGame/GameModes/LyraExperienceManagerComponent.cpp` | 93 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `HandleMatchAssignmentIfNotExpectingOne → Reset` | cross_community | 6 |
| `HandleMatchAssignmentIfNotExpectingOne → CreateHostingRequest` | cross_community | 5 |
| `HandleMatchAssignmentIfNotExpectingOne → HostSession` | cross_community | 5 |
| `HandleMatchAssignmentIfNotExpectingOne → GetNetId` | cross_community | 4 |
| `NotifyControllerChanged → GetClientServerContextString` | cross_community | 3 |
| `OnControllerChangedTeam → GetClientServerContextString` | cross_community | 3 |
| `OnControllerChangedTeam → GetClientServerContextString` | cross_community | 3 |
| `HandleMatchAssignmentIfNotExpectingOne → TryToLoginForOnlinePlay` | intra_community | 3 |
| `OnControllerChangedTeam → GetClientServerContextString` | cross_community | 3 |
| `OnPlayerStateChangedTeam → GetClientServerContextString` | cross_community | 3 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Private | 1 calls |

## How to Explore

1. `context({name: "GetClientServerContextString"})` — see callers and callees
2. `query({search_query: "gamemodes"})` — find related execution flows
3. Read key files listed above for implementation details
4. `explain({target: "<file or symbol>"})` — persisted taint findings (source→sink data flows), when indexed with `--pdg`
