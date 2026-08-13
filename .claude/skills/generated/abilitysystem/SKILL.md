---
name: abilitysystem
description: "Skill for the AbilitySystem area of LyraRPGGameplayAbility. 53 symbols across 12 files."
---

# AbilitySystem

53 symbols | 12 files | Cohesion: 96%

## When to Use

- Working with code in `Source/`
- Understanding how ILyraAbilitySourceInterface, ULyraRangedWeaponInstance, ULyraGameplayCueManager work
- Modifying abilitysystem-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `Source/LyraGame/AbilitySystem/LyraAbilitySystemComponent.cpp` | CancelAbilitiesByFunc, CancelInputActivatedAbilities, NotifyAbilityActivated, AddAbilityToActivationGroup, CancelActivationGroupAbilities (+11) |
| `Source/LyraGame/AbilitySystem/LyraGameplayCueManager.cpp` | Get, OnCreated, LoadAlwaysLoadedCues, ShouldAsyncLoadRuntimeObjectLibraries, DumpGameplayCues (+9) |
| `Source/LyraGame/AbilitySystem/LyraGlobalAbilitySystem.cpp` | AddToASC, ApplyAbilityToAll, ApplyEffectToAll, RegisterASC, RemoveFromAll (+4) |
| `Source/LyraGame/AbilitySystem/LyraGameplayEffectContext.h` | ExtractEffectContext, GetAbilitySource, GetPhysicalMaterial |
| `Source/LyraGame/AbilitySystem/LyraAbilitySet.h` | AddAbilitySpecHandle, AddGameplayEffectHandle, AddAttributeSet |
| `Source/LyraGame/AbilitySystem/LyraGameplayCueManager.h` | ULyraGameplayCueManager, Get |
| `Source/LyraGame/AbilitySystem/Executions/LyraDamageExecution.cpp` | Execute_Implementation |
| `Source/LyraGame/AbilitySystem/LyraGameplayAbilityTargetData_SingleTargetHit.cpp` | AddTargetDataToContext |
| `Source/LyraGame/Character/LyraCharacter.cpp` | HasMatchingGameplayTag |
| `Source/LyraGame/AbilitySystem/LyraAbilitySet.cpp` | GiveToAbilitySystem |

## Entry Points

Start here when exploring this area:

- **`ILyraAbilitySourceInterface`** (Class) — `Source/LyraGame/AbilitySystem/LyraAbilitySourceInterface.h:19`
- **`ULyraRangedWeaponInstance`** (Class) — `Source/LyraGame/Weapons/LyraRangedWeaponInstance.h:19`
- **`ULyraGameplayCueManager`** (Class) — `Source/LyraGame/AbilitySystem/LyraGameplayCueManager.h:20`
- **`Get`** (Method) — `Source/LyraGame/AbilitySystem/LyraGameplayCueManager.cpp:58`
- **`OnCreated`** (Method) — `Source/LyraGame/AbilitySystem/LyraGameplayCueManager.cpp:63`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `ILyraAbilitySourceInterface` | Class | `Source/LyraGame/AbilitySystem/LyraAbilitySourceInterface.h` | 19 |
| `ULyraRangedWeaponInstance` | Class | `Source/LyraGame/Weapons/LyraRangedWeaponInstance.h` | 19 |
| `ULyraGameplayCueManager` | Class | `Source/LyraGame/AbilitySystem/LyraGameplayCueManager.h` | 20 |
| `Get` | Method | `Source/LyraGame/AbilitySystem/LyraGameplayCueManager.cpp` | 58 |
| `OnCreated` | Method | `Source/LyraGame/AbilitySystem/LyraGameplayCueManager.cpp` | 63 |
| `LoadAlwaysLoadedCues` | Method | `Source/LyraGame/AbilitySystem/LyraGameplayCueManager.cpp` | 70 |
| `ShouldAsyncLoadRuntimeObjectLibraries` | Method | `Source/LyraGame/AbilitySystem/LyraGameplayCueManager.cpp` | 94 |
| `DumpGameplayCues` | Method | `Source/LyraGame/AbilitySystem/LyraGameplayCueManager.cpp` | 125 |
| `OnGameplayTagLoaded` | Method | `Source/LyraGame/AbilitySystem/LyraGameplayCueManager.cpp` | 179 |
| `HandlePostGarbageCollect` | Method | `Source/LyraGame/AbilitySystem/LyraGameplayCueManager.cpp` | 209 |
| `ProcessLoadedTags` | Method | `Source/LyraGame/AbilitySystem/LyraGameplayCueManager.cpp` | 218 |
| `ProcessTagToPreload` | Method | `Source/LyraGame/AbilitySystem/LyraGameplayCueManager.cpp` | 251 |
| `OnPreloadCueComplete` | Method | `Source/LyraGame/AbilitySystem/LyraGameplayCueManager.cpp` | 290 |
| `RegisterPreloadedCue` | Method | `Source/LyraGame/AbilitySystem/LyraGameplayCueManager.cpp` | 301 |
| `UpdateDelayLoadDelegateListeners` | Method | `Source/LyraGame/AbilitySystem/LyraGameplayCueManager.cpp` | 353 |
| `ShouldDelayLoadGameplayCues` | Method | `Source/LyraGame/AbilitySystem/LyraGameplayCueManager.cpp` | 380 |
| `RefreshGameplayCuePrimaryAsset` | Method | `Source/LyraGame/AbilitySystem/LyraGameplayCueManager.cpp` | 390 |
| `Execute_Implementation` | Method | `Source/LyraGame/AbilitySystem/Executions/LyraDamageExecution.cpp` | 35 |
| `AddTargetDataToContext` | Method | `Source/LyraGame/AbilitySystem/LyraGameplayAbilityTargetData_SingleTargetHit.cpp` | 12 |
| `ExtractEffectContext` | Method | `Source/LyraGame/AbilitySystem/LyraGameplayEffectContext.h` | 30 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `ProcessAbilityInput → GetAbilitySystemComponent` | cross_community | 4 |
| `Execute_Implementation → Reset` | cross_community | 3 |
| `LoadAlwaysLoadedCues → RegisterPreloadedCue` | intra_community | 3 |

## Connected Areas

| Area | Connections |
|------|-------------|
| GameFeatures | 2 calls |
| Character | 1 calls |

## How to Explore

1. `context({name: "ILyraAbilitySourceInterface"})` — see callers and callees
2. `query({search_query: "abilitysystem"})` — find related execution flows
3. Read key files listed above for implementation details
4. `explain({target: "<file or symbol>"})` — persisted taint findings (source→sink data flows), when indexed with `--pdg`
