---
name: teams
description: "Skill for the Teams area of LyraRPGGameplayAbility. 43 symbols across 11 files."
---

# Teams

43 symbols | 11 files | Cohesion: 91%

## When to Use

- Working with code in `Source/`
- Understanding how GenericTeamIdToInteger, ChangeTeamForActor, FindTeamFromObject work
- Modifying teams-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `Source/LyraGame/Teams/LyraTeamSubsystem.cpp` | ChangeTeamForActor, FindTeamFromObject, FindPlayerStateFromActor, CompareTeams, FindTeamFromActor (+5) |
| `Source/LyraGame/Teams/LyraTeamCreationComponent.cpp` | OnExperienceLoaded, ServerCreateTeams, ServerAssignPlayersToTeams, ServerChooseTeamForPlayer, OnPlayerInitialized (+2) |
| `Source/LyraGame/Teams/LyraTeamInfoBase.cpp` | BeginPlay, RegisterWithTeamSubsystem, TryRegisterWithTeamSubsystem, SetTeamId, OnRep_TeamId |
| `Source/LyraGame/Teams/AsyncAction_ObserveTeamColors.cpp` | SetReadyToDestroy, Activate, BroadcastChange, OnWatchedAgentChangedTeam, OnDisplayAssetChanged |
| `Source/LyraGame/Teams/AsyncAction_ObserveTeam.cpp` | SetReadyToDestroy, Activate, ObserveTeam, InternalObserveTeamChanges |
| `Source/LyraGame/Teams/LyraTeamAgentInterface.h` | GenericTeamIdToInteger, GetOnTeamIndexChangedDelegate, GetTeamChangedDelegateChecked |
| `Source/LyraGame/Teams/LyraTeamDisplayAsset.cpp` | ApplyToMeshComponent, ApplyToNiagaraComponent, ApplyToActor |
| `Source/LyraGame/Teams/LyraTeamPublicInfo.cpp` | SetTeamDisplayAsset, OnRep_TeamDisplayAsset |
| `Source/LyraGame/Teams/LyraTeamStatics.cpp` | FindTeamFromObject, GetTeamDisplayAsset |
| `Source/LyraGame/Teams/LyraTeamStatics.h` | GetTeamDisplayAsset |

## Entry Points

Start here when exploring this area:

- **`GenericTeamIdToInteger`** (Function) — `Source/LyraGame/Teams/LyraTeamAgentInterface.h:16`
- **`ChangeTeamForActor`** (Method) — `Source/LyraGame/Teams/LyraTeamSubsystem.cpp:133`
- **`FindTeamFromObject`** (Method) — `Source/LyraGame/Teams/LyraTeamSubsystem.cpp:152`
- **`FindPlayerStateFromActor`** (Method) — `Source/LyraGame/Teams/LyraTeamSubsystem.cpp:184`
- **`CompareTeams`** (Method) — `Source/LyraGame/Teams/LyraTeamSubsystem.cpp:221`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `GenericTeamIdToInteger` | Function | `Source/LyraGame/Teams/LyraTeamAgentInterface.h` | 16 |
| `ChangeTeamForActor` | Method | `Source/LyraGame/Teams/LyraTeamSubsystem.cpp` | 133 |
| `FindTeamFromObject` | Method | `Source/LyraGame/Teams/LyraTeamSubsystem.cpp` | 152 |
| `FindPlayerStateFromActor` | Method | `Source/LyraGame/Teams/LyraTeamSubsystem.cpp` | 184 |
| `CompareTeams` | Method | `Source/LyraGame/Teams/LyraTeamSubsystem.cpp` | 221 |
| `FindTeamFromActor` | Method | `Source/LyraGame/Teams/LyraTeamSubsystem.cpp` | 243 |
| `CanCauseDamage` | Method | `Source/LyraGame/Teams/LyraTeamSubsystem.cpp` | 344 |
| `GetTeamDisplayAsset` | Method | `Source/LyraGame/Teams/LyraTeamSubsystem.cpp` | 371 |
| `GetEffectiveTeamDisplayAsset` | Method | `Source/LyraGame/Teams/LyraTeamSubsystem.cpp` | 383 |
| `OnExperienceLoaded` | Method | `Source/LyraGame/Teams/LyraTeamCreationComponent.cpp` | 45 |
| `ServerCreateTeams` | Method | `Source/LyraGame/Teams/LyraTeamCreationComponent.cpp` | 58 |
| `ServerAssignPlayersToTeams` | Method | `Source/LyraGame/Teams/LyraTeamCreationComponent.cpp` | 67 |
| `ServerChooseTeamForPlayer` | Method | `Source/LyraGame/Teams/LyraTeamCreationComponent.cpp` | 86 |
| `OnPlayerInitialized` | Method | `Source/LyraGame/Teams/LyraTeamCreationComponent.cpp` | 99 |
| `ServerCreateTeam` | Method | `Source/LyraGame/Teams/LyraTeamCreationComponent.cpp` | 109 |
| `GetLeastPopulatedTeamID` | Method | `Source/LyraGame/Teams/LyraTeamCreationComponent.cpp` | 131 |
| `BeginPlay` | Method | `Source/LyraGame/Teams/LyraTeamInfoBase.cpp` | 30 |
| `RegisterWithTeamSubsystem` | Method | `Source/LyraGame/Teams/LyraTeamInfoBase.cpp` | 52 |
| `TryRegisterWithTeamSubsystem` | Method | `Source/LyraGame/Teams/LyraTeamInfoBase.cpp` | 57 |
| `SetTeamId` | Method | `Source/LyraGame/Teams/LyraTeamInfoBase.cpp` | 69 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `NotifyControllerChanged → GenericTeamIdToInteger` | cross_community | 3 |
| `OnControllerChangedTeam → GenericTeamIdToInteger` | cross_community | 3 |
| `OnControllerChangedTeam → GenericTeamIdToInteger` | cross_community | 3 |
| `OnControllerChangedTeam → GenericTeamIdToInteger` | cross_community | 3 |
| `OnPlayerStateChangedTeam → GenericTeamIdToInteger` | cross_community | 3 |
| `OnPlayerStateChangedTeam → GenericTeamIdToInteger` | cross_community | 3 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Player | 2 calls |
| GameFeatures | 1 calls |

## How to Explore

1. `context({name: "GenericTeamIdToInteger"})` — see callers and callees
2. `query({search_query: "teams"})` — find related execution flows
3. Read key files listed above for implementation details
4. `explain({target: "<file or symbol>"})` — persisted taint findings (source→sink data flows), when indexed with `--pdg`
