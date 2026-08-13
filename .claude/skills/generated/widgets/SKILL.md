---
name: widgets
description: "Skill for the Widgets area of LyraRPGGameplayAbility. 58 symbols across 16 files."
---

# Widgets

58 symbols | 16 files | Cohesion: 92%

## When to Use

- Working with code in `Plugins/`
- Understanding how UGameSettingListEntryBase, UGameSettingListEntry_Setting, UGameSettingListEntrySetting_Discrete work
- Modifying widgets-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `Plugins/GameSettings/Source/Private/Widgets/GameSettingPanel.cpp` | NativeConstruct, NativeDestruct, SetRegistry, RegisterRegistryEvents, UnregisterRegistryEvents (+8) |
| `Source/LyraGame/Settings/Widgets/LyraSettingsListEntrySetting_KeyboardInput.cpp` | HandlePrimaryKeySelected, HandleSecondaryKeySelected, HandlePrimaryDuplicateKeySelected, HandleSecondaryDuplicateKeySelected, ChangeBinding (+3) |
| `Plugins/GameSettings/Source/Public/Widgets/GameSettingListEntry.h` | UGameSettingListEntryBase, UGameSettingListEntry_Setting, UGameSettingListEntrySetting_Discrete, UGameSettingListEntrySetting_Scalar, UGameSettingListEntrySetting_Action (+1) |
| `Plugins/GameSettings/Source/Private/Widgets/GameSettingScreen.cpp` | ApplyChanges, CancelChanges, ClearDirtyState, AttemptToPopNavigation, NavigateToSetting (+1) |
| `Plugins/GameSubtitles/Source/Private/Widgets/SubtitleDisplay.cpp` | SynchronizeProperties, RebuildWidget, HandleSubtitleDisplayOptionsChanged, RebuildStyle |
| `Plugins/UIExtension/Source/Private/Widgets/UIExtensionPointWidget.cpp` | ReleaseSlateResources, RebuildWidget, ResetExtensionPoint, RegisterExtensionPoint |
| `Plugins/GameSettings/Source/Private/Widgets/GameSettingVisualData.cpp` | GetEntryForSetting, GatherDetailExtensions, GetCustomEntryForSetting |
| `Plugins/GameSettings/Source/Public/Widgets/GameSettingScreen.h` | UGameSettingScreen, NativeOnInitialized, GetOrCreateRegistry |
| `Plugins/GameSettings/Source/Public/Widgets/Misc/KeyAlreadyBoundWarning.h` | SetWarningText, SetCancelText |
| `Source/LyraGame/UI/LyraSettingScreen.cpp` | HandleCancelChangesAction, HandleBackAction |

## Entry Points

Start here when exploring this area:

- **`UGameSettingListEntryBase`** (Class) — `Plugins/GameSettings/Source/Public/Widgets/GameSettingListEntry.h:36`
- **`UGameSettingListEntry_Setting`** (Class) — `Plugins/GameSettings/Source/Public/Widgets/GameSettingListEntry.h:78`
- **`UGameSettingListEntrySetting_Discrete`** (Class) — `Plugins/GameSettings/Source/Public/Widgets/GameSettingListEntry.h:96`
- **`UGameSettingListEntrySetting_Scalar`** (Class) — `Plugins/GameSettings/Source/Public/Widgets/GameSettingListEntry.h:139`
- **`UGameSettingListEntrySetting_Action`** (Class) — `Plugins/GameSettings/Source/Public/Widgets/GameSettingListEntry.h:186`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `UGameSettingListEntryBase` | Class | `Plugins/GameSettings/Source/Public/Widgets/GameSettingListEntry.h` | 36 |
| `UGameSettingListEntry_Setting` | Class | `Plugins/GameSettings/Source/Public/Widgets/GameSettingListEntry.h` | 78 |
| `UGameSettingListEntrySetting_Discrete` | Class | `Plugins/GameSettings/Source/Public/Widgets/GameSettingListEntry.h` | 96 |
| `UGameSettingListEntrySetting_Scalar` | Class | `Plugins/GameSettings/Source/Public/Widgets/GameSettingListEntry.h` | 139 |
| `UGameSettingListEntrySetting_Action` | Class | `Plugins/GameSettings/Source/Public/Widgets/GameSettingListEntry.h` | 186 |
| `UGameSettingListEntrySetting_Navigation` | Class | `Plugins/GameSettings/Source/Public/Widgets/GameSettingListEntry.h` | 218 |
| `ULyraSettingsListEntrySetting_KeyboardInput` | Class | `Source/LyraGame/Settings/Widgets/LyraSettingsListEntrySetting_KeyboardInput.h` | 21 |
| `UGameSettingScreen` | Class | `Plugins/GameSettings/Source/Public/Widgets/GameSettingScreen.h` | 25 |
| `ULyraSettingScreen` | Class | `Source/LyraGame/UI/LyraSettingScreen.h` | 14 |
| `SetWarningText` | Method | `Plugins/GameSettings/Source/Public/Widgets/Misc/KeyAlreadyBoundWarning.h` | 21 |
| `SetCancelText` | Method | `Plugins/GameSettings/Source/Public/Widgets/Misc/KeyAlreadyBoundWarning.h` | 23 |
| `HandlePrimaryKeySelected` | Method | `Source/LyraGame/Settings/Widgets/LyraSettingsListEntrySetting_KeyboardInput.cpp` | 52 |
| `HandleSecondaryKeySelected` | Method | `Source/LyraGame/Settings/Widgets/LyraSettingsListEntrySetting_KeyboardInput.cpp` | 58 |
| `HandlePrimaryDuplicateKeySelected` | Method | `Source/LyraGame/Settings/Widgets/LyraSettingsListEntrySetting_KeyboardInput.cpp` | 64 |
| `HandleSecondaryDuplicateKeySelected` | Method | `Source/LyraGame/Settings/Widgets/LyraSettingsListEntrySetting_KeyboardInput.cpp` | 70 |
| `ChangeBinding` | Method | `Source/LyraGame/Settings/Widgets/LyraSettingsListEntrySetting_KeyboardInput.cpp` | 76 |
| `HandleClearClicked` | Method | `Source/LyraGame/Settings/Widgets/LyraSettingsListEntrySetting_KeyboardInput.cpp` | 125 |
| `NativeConstruct` | Method | `Plugins/GameSettings/Source/Private/Widgets/GameSettingPanel.cpp` | 29 |
| `NativeDestruct` | Method | `Plugins/GameSettings/Source/Private/Widgets/GameSettingPanel.cpp` | 37 |
| `SetRegistry` | Method | `Plugins/GameSettings/Source/Private/Widgets/GameSettingPanel.cpp` | 61 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `OnInitialize → GetDevName` | cross_community | 4 |
| `SetRegistry → GetDevName` | cross_community | 3 |
| `HandleSettingEditConditionsChanged → GetDevName` | cross_community | 3 |
| `HandleActorExtension → PushContentToLayer_ForPlayer` | cross_community | 3 |
| `HandleClearClicked → PushContentToLayer_ForPlayer` | cross_community | 3 |
| `HandleClearClicked → SetWarningText` | intra_community | 3 |
| `HandleClearClicked → SetCancelText` | intra_community | 3 |

## How to Explore

1. `context({name: "UGameSettingListEntryBase"})` — see callers and callees
2. `query({search_query: "widgets"})` — find related execution flows
3. Read key files listed above for implementation details
4. `explain({target: "<file or symbol>"})` — persisted taint findings (source→sink data flows), when indexed with `--pdg`
