---
name: gamefeatures
description: "Skill for the GameFeatures area of LyraRPGGameplayAbility. 138 symbols across 61 files."
---

# GameFeatures

138 symbols | 61 files | Cohesion: 96%

## When to Use

- Working with code in `Source/`
- Understanding how QueryParams, Suspend, ensure work
- Modifying gamefeatures-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `Source/LyraGame/GameFeatures/GameFeatureAction_AddInputContextMapping.cpp` | OnGameFeatureActivating, OnGameFeatureDeactivating, Reset, HandleControllerExtension, AddInputMappingForPlayer (+9) |
| `TypeScript/GameFeatures/Lifecycle.ts` | Activate, Register, Activate, ActivateModule, GameFeatureLifecycle (+6) |
| `TypeScript/GameFeatures/Bootstrap.ts` | CreateUeLifecycleAdapters, BootstrapGameFeatures, ResolvePlayerController, IsAuthority, GetCurrentZoneTag (+3) |
| `Source/LyraGame/UI/LyraHUDLayout.cpp` | NativeOnInitialized, HandleEscapeAction, HandleInputDeviceConnectionChanged, HandleInputDevicePairingChanged, ShouldPlatformDisplayControllerDisconnectScreen (+2) |
| `Source/LyraGame/GameFeatures/GameFeatureAction_AddAbilities.cpp` | OnGameFeatureActivating, OnGameFeatureDeactivating, Reset, HandleActorExtension, AddActorAbilities (+2) |
| `Source/LyraGame/GameFeatures/GameFeatureAction_AddInputBinding.cpp` | OnGameFeatureActivating, OnGameFeatureDeactivating, Reset, HandlePawnExtension, AddInputMappingForPlayer (+1) |
| `Source/LyraGame/GameFeatures/GameFeatureAction_AddWidget.cpp` | ensure, Reset, HandleActorExtension, AddWidgets, RemoveWidgets |
| `Plugins/GameSettings/Source/Private/Widgets/GameSettingListEntry.cpp` | SetSetting, NativeOnEntryReleased, Refresh, Suspend |
| `Plugins/CommonUser/Source/CommonUser/Private/CommonUserSubsystem.cpp` | UpdateCachedPrivilegeResult, SetNickname, ListenForLoginKeyInput |
| `Plugins/GameSettings/Source/Public/GameSettingValueDiscreteDynamic.h` | GetValueAsString, GetValue, GetValue |

## Entry Points

Start here when exploring this area:

- **`QueryParams`** (Function) — `Plugins/GameFeatures/ShooterCore/Source/ShooterCoreRuntime/Private/Input/AimAssistTargetManagerComponent.cpp:400`
- **`Suspend`** (Function) — `Plugins/GameSettings/Source/Private/Widgets/GameSettingListEntry.cpp:253`
- **`ensure`** (Function) — `Source/LyraGame/GameFeatures/GameFeatureAction_AddWidget.cpp:26`
- **`PropIt`** (Function) — `Source/LyraGame/Performance/LyraMemoryDebugCommands.cpp:99`
- **`CreateShooterGameFeature`** (Function) — `TypeScript/GameFeatures/Shooter/ShooterFeature.ts:32`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `ServiceRegistry` | Class | `TypeScript/GameFeatures/Shooter/Services/ServiceRegistry.ts` | 18 |
| `UGameFeatureAction_AddAbilities` | Class | `Source/LyraGame/GameFeatures/GameFeatureAction_AddAbilities.h` | 74 |
| `UGameFeatureAction_AddInputBinding` | Class | `Source/LyraGame/GameFeatures/GameFeatureAction_AddInputBinding.h` | 20 |
| `UGameFeatureAction_AddInputContextMapping` | Class | `Source/LyraGame/GameFeatures/GameFeatureAction_AddInputContextMapping.h` | 36 |
| `UGameFeatureAction_AddWidgets` | Class | `Source/LyraGame/GameFeatures/GameFeatureAction_AddWidget.h` | 49 |
| `UGameFeatureAction_SplitscreenConfig` | Class | `Source/LyraGame/GameFeatures/GameFeatureAction_SplitscreenConfig.h` | 21 |
| `UGameFeatureAction_WorldActionBase` | Class | `Source/LyraGame/GameFeatures/GameFeatureAction_WorldActionBase.h` | 21 |
| `GameFeatureLifecycle` | Class | `TypeScript/GameFeatures/Lifecycle.ts` | 66 |
| `QueryParams` | Function | `Plugins/GameFeatures/ShooterCore/Source/ShooterCoreRuntime/Private/Input/AimAssistTargetManagerComponent.cpp` | 400 |
| `Suspend` | Function | `Plugins/GameSettings/Source/Private/Widgets/GameSettingListEntry.cpp` | 253 |
| `ensure` | Function | `Source/LyraGame/GameFeatures/GameFeatureAction_AddWidget.cpp` | 26 |
| `PropIt` | Function | `Source/LyraGame/Performance/LyraMemoryDebugCommands.cpp` | 99 |
| `CreateShooterGameFeature` | Function | `TypeScript/GameFeatures/Shooter/ShooterFeature.ts` | 32 |
| `RegisterShooterGameFeatures` | Function | `TypeScript/GameFeatures/Shooter/ShooterFeature.ts` | 72 |
| `BootstrapGameFeatures` | Function | `TypeScript/GameFeatures/Bootstrap.ts` | 123 |
| `CreateTravelGateway` | Function | `TypeScript/GameFeatures/Bootstrap.ts` | 136 |
| `Subscribe` | Function | `TypeScript/GameFeatures/Lifecycle.ts` | 198 |
| `Init` | Method | `Plugins/CommonGame/Source/Private/CommonGameInstance.cpp` | 81 |
| `PushContentToLayer_ForPlayer` | Method | `Plugins/CommonGame/Source/Private/CommonUIExtensions.cpp` | 54 |
| `PushStreamedContentToLayer_ForPlayer` | Method | `Plugins/CommonGame/Source/Private/CommonUIExtensions.cpp` | 75 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `OnUserRequestedSession → Reset` | cross_community | 7 |
| `NativePreConstruct → Reset` | cross_community | 7 |
| `QuickPlaySession → Reset` | cross_community | 6 |
| `BootstrapGameFeatures → CreateWorldRef` | cross_community | 6 |
| `BootstrapGameFeatures → TimerScope` | cross_community | 6 |
| `BootstrapGameFeatures → DisposableScope` | cross_community | 6 |
| `HandleMatchAssignmentIfNotExpectingOne → Reset` | cross_community | 6 |
| `OverrideInputKeyForLogin → Reset` | cross_community | 5 |
| `HandleControllerPairingChanged → Reset` | cross_community | 5 |
| `ModifyRaw_Implementation → Reset` | cross_community | 5 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Scopes | 1 calls |
| Widgets | 1 calls |

## How to Explore

1. `context({name: "QueryParams"})` — see callers and callees
2. `query({search_query: "gamefeatures"})` — find related execution flows
3. Read key files listed above for implementation details
4. `explain({target: "<file or symbol>"})` — persisted taint findings (source→sink data flows), when indexed with `--pdg`
