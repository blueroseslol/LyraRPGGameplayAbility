---
name: public
description: "Skill for the Public area of LyraRPGGameplayAbility. 95 symbols across 39 files."
---

# Public

95 symbols | 39 files | Cohesion: 93%

## When to Use

- Working with code in `Plugins/`
- Understanding how UGameSetting, UGameSettingAction, UGameSettingCollection work
- Modifying public-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `Plugins/GameSettings/Source/Public/GameSettingValueDiscreteDynamic.h` | UGameSettingValueDiscreteDynamic, UGameSettingValueDiscreteDynamic_Bool, UGameSettingValueDiscreteDynamic_Color, UGameSettingValueDiscreteDynamic_Vector2D, SetDefaultValueFromString (+10) |
| `Plugins/GameSettings/Source/Public/GameSetting.h` | GetDisplayName, GetDescriptionRichText, GetDynamicDetails, GetWarningRichText, UGameSetting (+6) |
| `Plugins/GameSettings/Source/Public/GameSettingFilterState.h` | IsEnabled, GetDisabledReasons, GetDisabledOptions, Hide, UnableToReset (+4) |
| `Plugins/GameSettings/Source/Public/GameSettingValueScalar.h` | GetDefaultValueNormalized, GetDefaultValue, GetValue, GetSourceRange, GetSourceStep (+2) |
| `Plugins/AsyncMixin/Source/Public/AsyncMixin.h` | IsLoadingComplete, IsLoadingInProgress, IsComplete, FAsyncMixin, FAsyncScope |
| `Plugins/CommonUser/Source/CommonUser/Public/CommonUserSubsystem.h` | ResetUserState, GetUserInfoForLocalPlayerIndex, TryToInitializeForLocalPlay, ShouldWaitForStartInput |
| `Plugins/GameSettings/Source/Private/Widgets/GameSettingDetailView.cpp` | NativeOnInitialized, FillSettingDetails, CreateDetailsExtension |
| `Source/LyraGame/Settings/LyraGameSettingRegistry_Video.cpp` | GatherEditState, GatherEditState |
| `Plugins/GameSettings/Source/Public/GameSettingCollection.h` | UGameSettingCollection, UGameSettingCollectionPage |
| `Source/LyraGame/UI/Frontend/LyraFrontendStateComponent.cpp` | FlowStep_WaitForUserInitialization, FlowStep_TryShowPressStartScreen |

## Entry Points

Start here when exploring this area:

- **`UGameSetting`** (Class) — `Plugins/GameSettings/Source/Public/GameSetting.h:26`
- **`UGameSettingAction`** (Class) — `Plugins/GameSettings/Source/Public/GameSettingAction.h:22`
- **`UGameSettingCollection`** (Class) — `Plugins/GameSettings/Source/Public/GameSettingCollection.h:17`
- **`UGameSettingCollectionPage`** (Class) — `Plugins/GameSettings/Source/Public/GameSettingCollection.h:43`
- **`UGameSettingValue`** (Class) — `Plugins/GameSettings/Source/Public/GameSettingValue.h:21`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `UGameSetting` | Class | `Plugins/GameSettings/Source/Public/GameSetting.h` | 26 |
| `UGameSettingAction` | Class | `Plugins/GameSettings/Source/Public/GameSettingAction.h` | 22 |
| `UGameSettingCollection` | Class | `Plugins/GameSettings/Source/Public/GameSettingCollection.h` | 17 |
| `UGameSettingCollectionPage` | Class | `Plugins/GameSettings/Source/Public/GameSettingCollection.h` | 43 |
| `UGameSettingValue` | Class | `Plugins/GameSettings/Source/Public/GameSettingValue.h` | 21 |
| `ILoadingProcessInterface` | Class | `Plugins/CommonLoadingScreen/Source/CommonLoadingScreen/Public/LoadingProcessInterface.h` | 18 |
| `ULoadingProcessTask` | Class | `Plugins/CommonLoadingScreen/Source/CommonLoadingScreen/Public/LoadingProcessTask.h` | 14 |
| `ULyraExperienceManagerComponent` | Class | `Source/LyraGame/GameModes/LyraExperienceManagerComponent.h` | 29 |
| `ULyraFrontendStateComponent` | Class | `Source/LyraGame/UI/Frontend/LyraFrontendStateComponent.h` | 23 |
| `ALyraWorldCollectable` | Class | `Plugins/GameFeatures/ShooterCore/Source/ShooterCoreRuntime/Public/LyraWorldCollectable.h` | 18 |
| `ALyraTravelInteractionPoint` | Class | `Plugins/GameFeatures/ShooterCore/Source/ShooterCoreRuntime/Public/Travel/LyraTravelInteractionPoint.h` | 27 |
| `IInteractableTarget` | Class | `Source/LyraGame/Interaction/IInteractableTarget.h` | 40 |
| `IPickupable` | Class | `Source/LyraGame/Inventory/IPickupable.h` | 64 |
| `UGameSettingValueDiscreteDynamic` | Class | `Plugins/GameSettings/Source/Public/GameSettingValueDiscreteDynamic.h` | 20 |
| `UGameSettingValueDiscreteDynamic_Bool` | Class | `Plugins/GameSettings/Source/Public/GameSettingValueDiscreteDynamic.h` | 78 |
| `UGameSettingValueDiscreteDynamic_Color` | Class | `Plugins/GameSettings/Source/Public/GameSettingValueDiscreteDynamic.h` | 195 |
| `UGameSettingValueDiscreteDynamic_Vector2D` | Class | `Plugins/GameSettings/Source/Public/GameSettingValueDiscreteDynamic.h` | 236 |
| `UGameSettingValueDiscreteDynamic_Number` | Class | `Plugins/GameSettings/Source/Public/GameSettingValueDiscreteDynamic.h` | 102 |
| `UGameSettingValueDiscreteDynamic_Enum` | Class | `Plugins/GameSettings/Source/Public/GameSettingValueDiscreteDynamic.h` | 149 |
| `FAsyncMixin` | Class | `Plugins/AsyncMixin/Source/Public/AsyncMixin.h` | 71 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `OnUserRequestedSession → Reset` | cross_community | 7 |
| `OnUserRequestedSession → ResetUserState` | cross_community | 6 |
| `OnUserRequestedSession → CleanUpSessions` | cross_community | 6 |
| `OnInitialize → Hide` | cross_community | 4 |
| `OnInitialize → HideFromAnalytics` | cross_community | 4 |
| `OnInitialize → UnableToReset` | cross_community | 4 |
| `FlowStep_WaitForUserInitialization → Reset` | cross_community | 3 |
| `GatherEditState → Hide` | cross_community | 3 |
| `GatherEditState → HideFromAnalytics` | cross_community | 3 |
| `GatherEditState → UnableToReset` | cross_community | 3 |

## Connected Areas

| Area | Connections |
|------|-------------|
| GameFeatures | 3 calls |
| Private | 1 calls |

## How to Explore

1. `context({name: "UGameSetting"})` — see callers and callees
2. `query({search_query: "public"})` — find related execution flows
3. Read key files listed above for implementation details
4. `explain({target: "<file or symbol>"})` — persisted taint findings (source→sink data flows), when indexed with `--pdg`
