---
name: settings
description: "Skill for the Settings area of LyraRPGGameplayAbility. 129 symbols across 19 files."
---

# Settings

129 symbols | 19 files | Cohesion: 86%

## When to Use

- Working with code in `Source/`
- Understanding how Guard, AddFrameRateOptions, ConstrainFrameRateToBeCompatibleWithOverallQuality work
- Modifying settings-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `Source/LyraGame/Settings/LyraSettingsLocal.cpp` | ULyraSettingsLocal, SetToDefaults, LoadSettings, BeginDestroy, Get (+68) |
| `Source/LyraGame/Settings/LyraSettingsShared.cpp` | SaveSettings, CreateTemporarySettings, LoadOrCreateSettings, AsyncLoadOrCreateSettings, ApplySettings (+9) |
| `Source/LyraGame/Settings/LyraSettingsShared.h` | SetMouseSensitivityX, SetMouseSensitivityY, SetTargetingMultiplier, SetInvertVerticalAxis, SetInvertHorizontalAxis (+8) |
| `Source/LyraGame/Settings/LyraGameSettingRegistry_PerfStats.cpp` | FGameSettingEditCondition_LatencyStatsSupported, FGameSettingEditCondition_LatencyStatsCurrentlyEnabled, FGameSettingEditCondition_LatencyMarkersSupported, GatherEditState, GatherEditState (+2) |
| `Source/LyraGame/Settings/LyraGameSettingRegistry_Video.cpp` | FGameSettingEditCondition_FramePacingMode, FGameSettingEditCondition_VideoQuality, InitializeVideoSettings, AddFrameRateOptions, InitializeVideoSettings_FrameRates |
| `Plugins/GameSettings/Source/Public/GameSettingFilterState.h` | FGameSettingEditCondition, Disable |
| `Plugins/GameSettings/Source/Private/Registry/GameSettingRegistry.cpp` | Initialize, Regenerate |
| `Source/LyraGame/Settings/LyraSettingsLocal.h` | SetSafeZone, ApplySafeZoneScale |
| `Plugins/GameSettings/Source/Public/EditCondition/WhenCondition.h` | FWhenCondition |
| `Plugins/GameSettings/Source/Public/EditCondition/WhenPlatformHasTrait.h` | FWhenPlatformHasTrait |

## Entry Points

Start here when exploring this area:

- **`Guard`** (Function) — `Source/LyraGame/Settings/LyraSettingsLocal.cpp:1296`
- **`AddFrameRateOptions`** (Function) — `Source/LyraGame/Settings/LyraGameSettingRegistry_Video.cpp:614`
- **`ConstrainFrameRateToBeCompatibleWithOverallQuality`** (Function) — `Source/LyraGame/Settings/LyraSettingsLocal.cpp:304`
- **`GetFirstFrameRateWithQualityLimit`** (Function) — `Source/LyraGame/Settings/LyraSettingsLocal.cpp:326`
- **`GetLowestQualityWithFrameRateLimit`** (Function) — `Source/LyraGame/Settings/LyraSettingsLocal.cpp:332`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `FWhenCondition` | Class | `Plugins/GameSettings/Source/Public/EditCondition/WhenCondition.h` | 6 |
| `FWhenPlatformHasTrait` | Class | `Plugins/GameSettings/Source/Public/EditCondition/WhenPlatformHasTrait.h` | 16 |
| `FWhenPlayingAsPrimaryPlayer` | Class | `Plugins/GameSettings/Source/Public/EditCondition/WhenPlayingAsPrimaryPlayer.h` | 11 |
| `FGameSettingEditCondition` | Class | `Plugins/GameSettings/Source/Public/GameSettingFilterState.h` | 158 |
| `FGameSettingEditCondition_PerfStatAllowed` | Class | `Source/LyraGame/Settings/CustomSettings/LyraSettingValueDiscrete_PerfStat.cpp` | 17 |
| `FGameSettingEditCondition_LatencyStatsSupported` | Class | `Source/LyraGame/Settings/LyraGameSettingRegistry_PerfStats.cpp` | 23 |
| `FGameSettingEditCondition_LatencyStatsCurrentlyEnabled` | Class | `Source/LyraGame/Settings/LyraGameSettingRegistry_PerfStats.cpp` | 38 |
| `FGameSettingEditCondition_LatencyMarkersSupported` | Class | `Source/LyraGame/Settings/LyraGameSettingRegistry_PerfStats.cpp` | 92 |
| `FGameSettingEditCondition_FramePacingMode` | Class | `Source/LyraGame/Settings/LyraGameSettingRegistry_Video.cpp` | 36 |
| `FGameSettingEditCondition_VideoQuality` | Class | `Source/LyraGame/Settings/LyraGameSettingRegistry_Video.cpp` | 65 |
| `Guard` | Function | `Source/LyraGame/Settings/LyraSettingsLocal.cpp` | 1296 |
| `AddFrameRateOptions` | Function | `Source/LyraGame/Settings/LyraGameSettingRegistry_Video.cpp` | 614 |
| `ConstrainFrameRateToBeCompatibleWithOverallQuality` | Function | `Source/LyraGame/Settings/LyraSettingsLocal.cpp` | 304 |
| `GetFirstFrameRateWithQualityLimit` | Function | `Source/LyraGame/Settings/LyraSettingsLocal.cpp` | 326 |
| `GetLowestQualityWithFrameRateLimit` | Function | `Source/LyraGame/Settings/LyraSettingsLocal.cpp` | 332 |
| `CombineFrameRateLimits` | Function | `Source/LyraGame/Settings/LyraSettingsLocal.cpp` | 435 |
| `GetApplicableOverallQualityLimit` | Function | `Source/LyraGame/Settings/LyraSettingsLocal.cpp` | 289 |
| `GetApplicableResolutionQualityLimit` | Function | `Source/LyraGame/Settings/LyraSettingsLocal.cpp` | 294 |
| `GetApplicableResolutionQualityRecommendation` | Function | `Source/LyraGame/Settings/LyraSettingsLocal.cpp` | 299 |
| `FillScalabilitySettingsFromDeviceProfile` | Function | `Source/LyraGame/Settings/LyraSettingsLocal.cpp` | 264 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `ResetToMobileDeviceDefaults → GetDefaultMobileFrameRate` | cross_community | 5 |
| `ResetToMobileDeviceDefaults → GetMaxMobileFrameRate` | cross_community | 5 |
| `ResetToMobileDeviceDefaults → ClampQualityLevelsToDeviceProfile` | cross_community | 5 |
| `ResetToMobileDeviceDefaults → Get` | cross_community | 5 |
| `ResetToMobileDeviceDefaults → ShouldUseFrontendPerformanceSettings` | cross_community | 5 |
| `ResetToMobileDeviceDefaults → CombineFrameRateLimits` | cross_community | 5 |
| `ConstrainFrameRateToBeCompatibleWithOverallQuality → UpdateCache` | cross_community | 4 |
| `Guard → GetHighestLevelOfAnyScalabilityChannel` | intra_community | 4 |
| `Guard → SetOverallScalabilityLevel` | intra_community | 4 |
| `Guard → Get` | intra_community | 4 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Public | 5 calls |
| GameFeatures | 1 calls |
| Registry | 1 calls |

## How to Explore

1. `context({name: "Guard"})` — see callers and callees
2. `query({search_query: "settings"})` — find related execution flows
3. Read key files listed above for implementation details
4. `explain({target: "<file or symbol>"})` — persisted taint findings (source→sink data flows), when indexed with `--pdg`
