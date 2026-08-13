---
name: customsettings
description: "Skill for the CustomSettings area of LyraRPGGameplayAbility. 55 symbols across 8 files."
---

# CustomSettings

55 symbols | 8 files | Cohesion: 80%

## When to Use

- Working with code in `Source/`
- Understanding how NotifySettingChanged, OnSettingChanged, ExecuteAction work
- Modifying customsettings-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `Source/LyraGame/Settings/CustomSettings/LyraSettingKeyboardInput.cpp` | GetSettingDisplayName, GetSettingDisplayCategory, FindKeyMappingRow, OnInitialized, IsMappingCustomized (+8) |
| `Source/LyraGame/Settings/CustomSettings/LyraSettingValueDiscrete_Resolution.cpp` | SetDiscreteOptionByIndex, OnDependencyChanged, SelectAppropriateResolutions, FindClosestResolutionIndex, OnInitialized (+6) |
| `Source/LyraGame/Settings/CustomSettings/LyraSettingValueDiscrete_MobileFPSType.cpp` | GetDefaultFPS, ResetToDefault, RestoreToInitial, SetDiscreteOptionByIndex, SetValue (+5) |
| `Source/LyraGame/Settings/CustomSettings/LyraSettingValueDiscrete_PerfStat.cpp` | ResetToDefault, RestoreToInitial, SetDiscreteOptionByIndex, Get, SetStat (+2) |
| `Plugins/GameSettings/Source/Private/GameSetting.cpp` | NotifySettingChanged, OnSettingChanged, NotifyEditConditionsChanged, OnEditConditionsChanged, AddEditCondition |
| `Source/LyraGame/Settings/CustomSettings/LyraSettingValueDiscrete_OverallQuality.cpp` | SetDiscreteOptionByIndex, GetDiscreteOptionIndex, GetDiscreteOptions, GetCustomOptionIndex, GetOverallQualityLevel |
| `Source/LyraGame/Settings/CustomSettings/LyraSettingValueDiscrete_Language.cpp` | ResetToDefault, RestoreToInitial, SetDiscreteOptionByIndex |
| `Plugins/GameSettings/Source/Private/GameSettingAction.cpp` | ExecuteAction |

## Entry Points

Start here when exploring this area:

- **`NotifySettingChanged`** (Method) — `Plugins/GameSettings/Source/Private/GameSetting.cpp:177`
- **`OnSettingChanged`** (Method) — `Plugins/GameSettings/Source/Private/GameSetting.cpp:194`
- **`ExecuteAction`** (Method) — `Plugins/GameSettings/Source/Private/GameSettingAction.cpp:35`
- **`ResetToDefault`** (Method) — `Source/LyraGame/Settings/CustomSettings/LyraSettingValueDiscrete_Language.cpp:55`
- **`RestoreToInitial`** (Method) — `Source/LyraGame/Settings/CustomSettings/LyraSettingValueDiscrete_Language.cpp:60`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `NotifySettingChanged` | Method | `Plugins/GameSettings/Source/Private/GameSetting.cpp` | 177 |
| `OnSettingChanged` | Method | `Plugins/GameSettings/Source/Private/GameSetting.cpp` | 194 |
| `ExecuteAction` | Method | `Plugins/GameSettings/Source/Private/GameSettingAction.cpp` | 35 |
| `ResetToDefault` | Method | `Source/LyraGame/Settings/CustomSettings/LyraSettingValueDiscrete_Language.cpp` | 55 |
| `RestoreToInitial` | Method | `Source/LyraGame/Settings/CustomSettings/LyraSettingValueDiscrete_Language.cpp` | 60 |
| `SetDiscreteOptionByIndex` | Method | `Source/LyraGame/Settings/CustomSettings/LyraSettingValueDiscrete_Language.cpp` | 69 |
| `ResetToDefault` | Method | `Source/LyraGame/Settings/CustomSettings/LyraSettingValueDiscrete_PerfStat.cpp` | 95 |
| `RestoreToInitial` | Method | `Source/LyraGame/Settings/CustomSettings/LyraSettingValueDiscrete_PerfStat.cpp` | 102 |
| `SetDiscreteOptionByIndex` | Method | `Source/LyraGame/Settings/CustomSettings/LyraSettingValueDiscrete_PerfStat.cpp` | 109 |
| `NotifyEditConditionsChanged` | Method | `Plugins/GameSettings/Source/Private/GameSetting.cpp` | 244 |
| `OnEditConditionsChanged` | Method | `Plugins/GameSettings/Source/Private/GameSetting.cpp` | 251 |
| `SetDiscreteOptionByIndex` | Method | `Source/LyraGame/Settings/CustomSettings/LyraSettingValueDiscrete_Resolution.cpp` | 39 |
| `OnDependencyChanged` | Method | `Source/LyraGame/Settings/CustomSettings/LyraSettingValueDiscrete_Resolution.cpp` | 67 |
| `SelectAppropriateResolutions` | Method | `Source/LyraGame/Settings/CustomSettings/LyraSettingValueDiscrete_Resolution.cpp` | 186 |
| `FindClosestResolutionIndex` | Method | `Source/LyraGame/Settings/CustomSettings/LyraSettingValueDiscrete_Resolution.cpp` | 299 |
| `GetSettingDisplayName` | Method | `Source/LyraGame/Settings/CustomSettings/LyraSettingKeyboardInput.cpp` | 28 |
| `GetSettingDisplayCategory` | Method | `Source/LyraGame/Settings/CustomSettings/LyraSettingKeyboardInput.cpp` | 41 |
| `FindKeyMappingRow` | Method | `Source/LyraGame/Settings/CustomSettings/LyraSettingKeyboardInput.cpp` | 54 |
| `OnInitialized` | Method | `Source/LyraGame/Settings/CustomSettings/LyraSettingKeyboardInput.cpp` | 90 |
| `IsMappingCustomized` | Method | `Source/LyraGame/Settings/CustomSettings/LyraSettingKeyboardInput.cpp` | 231 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `SetDiscreteOptionByIndex → OnSettingChanged` | cross_community | 5 |
| `GetKeyTextFromSlot → Reset` | cross_community | 5 |
| `StoreInitial → Reset` | cross_community | 5 |
| `IsMappingCustomized → Reset` | cross_community | 5 |
| `OnDependencyChanged → OnEditConditionsChanged` | intra_community | 4 |
| `OnDependencyChanged → OnSettingChanged` | cross_community | 4 |
| `ResetToDefault → OnSettingChanged` | cross_community | 4 |
| `GetKeyTextFromSlot → GetUserSettings` | cross_community | 4 |
| `StoreInitial → GetUserSettings` | cross_community | 4 |
| `IsMappingCustomized → GetUserSettings` | cross_community | 4 |

## Connected Areas

| Area | Connections |
|------|-------------|
| GameFeatures | 2 calls |

## How to Explore

1. `context({name: "NotifySettingChanged"})` — see callers and callees
2. `query({search_query: "customsettings"})` — find related execution flows
3. Read key files listed above for implementation details
4. `explain({target: "<file or symbol>"})` — persisted taint findings (source→sink data flows), when indexed with `--pdg`
