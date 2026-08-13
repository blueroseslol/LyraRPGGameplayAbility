---
name: private
description: "Skill for the Private area of LyraRPGGameplayAbility. 391 symbols across 47 files."
---

# Private

391 symbols | 47 files | Cohesion: 82%

## When to Use

- Working with code in `Plugins/`
- Understanding how SessionName, PropertyIt, IndicatorPtr work
- Modifying private-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `Plugins/CommonUser/Source/CommonUser/Private/CommonUserSubsystem.cpp` | LogOutLocalUser, TryToLogOutUser, HandleOnLoginUIClosed, GetUserInfoForPlatformUserIndex, GetUserInfoForPlatformUser (+86) |
| `Plugins/CommonUser/Source/CommonUser/Private/CommonSessionSubsystem.cpp` | HandleQuickPlaySearchFinished, JoinSession, JoinSessionInternal, JoinSessionInternalOSSv1, JoinSessionInternalOSSv2 (+54) |
| `Plugins/CommonLoadingScreen/Source/CommonLoadingScreen/Private/LoadingScreenManager.cpp` | FLoadingScreenInputPreProcessor, Deinitialize, Tick, HandlePreLoadMap, UpdateLoadingScreen (+19) |
| `Plugins/UIExtension/Source/Private/UIExtensionSystem.cpp` | Unregister, UnregisterExtension, UnregisterExtensionPoint, IsValid, IsValid (+16) |
| `Plugins/CommonGame/Source/Private/CommonPlayerInputKey.cpp` | SetText, UpdateTextSize, NativePreConstruct, StartHoldProgress, StopHoldProgress (+13) |
| `Plugins/GameSettings/Source/Private/GameSettingValueDiscreteDynamic.cpp` | SetDefaultValueFromString, AddDynamicOption, RemoveDynamicOption, UGameSettingValueDiscreteDynamic_Bool, SetTrueText (+12) |
| `Plugins/GameFeatures/ShooterTests/Source/ShooterTestsRuntime/Private/ShooterTestAsyncMessageTestActor.cpp` | EndPlay, SetupColorListener, ResetListenerToColor, HandleColorChange, GetColorChangeToListenTo (+8) |
| `Plugins/GameSettings/Source/Private/GameSetting.cpp` | Initialize, Startup, StartupComplete, OnInitialized, ComputeEditableState (+8) |
| `Plugins/CommonUser/Source/CommonUser/Public/CommonUserSubsystem.h` | GetCachedPrivilegeResult, GetPlatformUserId, IsLoggedIn, IsDoingLogin, GetPrivilegeAvailability (+7) |
| `Plugins/CommonGame/Source/Private/GameUIPolicy.cpp` | GetOwningUIManager, GetWorld, NotifyPlayerAdded, AddLayoutToViewport, OnRootLayoutAddedToViewport (+7) |

## Entry Points

Start here when exploring this area:

- **`SessionName`** (Function) — `Plugins/CommonUser/Source/CommonUser/Private/CommonSessionSubsystem.cpp:520`
- **`PropertyIt`** (Function) — `Plugins/GameplayMessageRouter/Source/GameplayMessageNodes/Private/K2Node_AsyncAction_ListenForGameplayMessages.cpp:113`
- **`IndicatorPtr`** (Function) — `Source/LyraGame/UI/IndicatorSystem/SActorCanvas.cpp:567`
- **`TEST_METHOD`** (Function) — `Plugins/GameFeatures/ShooterTests/Source/ShooterTestsRuntime/Private/ShooterTestsActorAnimationTests.cpp:59`
- **`IsCurrentlyEquippedWeapon`** (Function) — `Plugins/GameFeatures/ShooterTests/Source/ShooterTestsRuntime/Private/ShooterTestsActorAnimationTests.cpp:114`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `FLoadingScreenInputPreProcessor` | Class | `Plugins/CommonLoadingScreen/Source/CommonLoadingScreen/Private/LoadingScreenManager.cpp` | 98 |
| `FSettingFilterExpressionContext` | Class | `Plugins/GameSettings/Source/Private/GameSettingFilterState.cpp` | 9 |
| `FCommonOnlineSearchSettingsBase` | Class | `Plugins/CommonUser/Source/CommonUser/Private/CommonSessionSubsystem.cpp` | 143 |
| `FCommonOnlineSearchSettingsOSSv1` | Class | `Plugins/CommonUser/Source/CommonUser/Private/CommonSessionSubsystem.cpp` | 199 |
| `FCommonOnlineSearchSettingsOSSv2` | Class | `Plugins/CommonUser/Source/CommonUser/Private/CommonSessionSubsystem.cpp` | 221 |
| `SessionName` | Function | `Plugins/CommonUser/Source/CommonUser/Private/CommonSessionSubsystem.cpp` | 520 |
| `PropertyIt` | Function | `Plugins/GameplayMessageRouter/Source/GameplayMessageNodes/Private/K2Node_AsyncAction_ListenForGameplayMessages.cpp` | 113 |
| `IndicatorPtr` | Function | `Source/LyraGame/UI/IndicatorSystem/SActorCanvas.cpp` | 567 |
| `TEST_METHOD` | Function | `Plugins/GameFeatures/ShooterTests/Source/ShooterTestsRuntime/Private/ShooterTestsActorAnimationTests.cpp` | 59 |
| `IsCurrentlyEquippedWeapon` | Function | `Plugins/GameFeatures/ShooterTests/Source/ShooterTestsRuntime/Private/ShooterTestsActorAnimationTests.cpp` | 114 |
| `SpawnWeaponSpawnerPad` | Function | `Plugins/GameFeatures/ShooterTests/Source/ShooterTestsRuntime/Private/ShooterTestsActorAnimationTests.cpp` | 129 |
| `EquipSpawnedWeapon` | Function | `Plugins/GameFeatures/ShooterTests/Source/ShooterTestsRuntime/Private/ShooterTestsActorAnimationTests.cpp` | 153 |
| `DoDamageToPlayer` | Function | `Plugins/GameFeatures/ShooterTests/Source/ShooterTestsRuntime/Private/ShooterTestsMapTests.cpp` | 42 |
| `SpawnGameplayPad` | Function | `Plugins/GameFeatures/ShooterTests/Source/ShooterTestsRuntime/Private/ShooterTestsMapTests.cpp` | 53 |
| `IsPlayerDamaged` | Function | `Plugins/GameFeatures/ShooterTests/Source/ShooterTestsRuntime/Private/ShooterTestsMapTests.cpp` | 69 |
| `TEST_METHOD` | Function | `Plugins/GameFeatures/ShooterTests/Source/ShooterTestsRuntime/Private/ShooterTestsMapTests.cpp` | 102 |
| `Guard` | Function | `Plugins/GameSettings/Source/Private/GameSetting.cpp` | 189 |
| `SetText` | Method | `Plugins/CommonGame/Source/Private/CommonPlayerInputKey.cpp` | 79 |
| `UpdateTextSize` | Method | `Plugins/CommonGame/Source/Private/CommonPlayerInputKey.cpp` | 85 |
| `NativePreConstruct` | Method | `Plugins/CommonGame/Source/Private/CommonPlayerInputKey.cpp` | 104 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `OnUserRequestedSession → Reset` | cross_community | 7 |
| `NativePreConstruct → Reset` | cross_community | 7 |
| `NativePreConstruct → UpdateTextSize` | intra_community | 7 |
| `QuickPlaySession → Reset` | cross_community | 6 |
| `OnUserRequestedSession → ResetUserState` | cross_community | 6 |
| `OnUserRequestedSession → CleanUpSessions` | cross_community | 6 |
| `HandleMatchAssignmentIfNotExpectingOne → Reset` | cross_community | 6 |
| `OverrideInputKeyForLogin → Reset` | cross_community | 5 |
| `QuickPlaySession → NotifySearchFinished` | cross_community | 5 |
| `HandleControllerPairingChanged → Reset` | cross_community | 5 |

## Connected Areas

| Area | Connections |
|------|-------------|
| GameFeatures | 38 calls |
| CustomSettings | 4 calls |
| Public | 2 calls |
| Messages | 1 calls |
| UI | 1 calls |
| Widgets | 1 calls |
| IndicatorSystem | 1 calls |

## How to Explore

1. `context({name: "SessionName"})` — see callers and callees
2. `query({search_query: "private"})` — find related execution flows
3. Read key files listed above for implementation details
4. `explain({target: "<file or symbol>"})` — persisted taint findings (source→sink data flows), when indexed with `--pdg`
