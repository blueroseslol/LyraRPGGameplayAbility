---
name: abilities
description: "Skill for the Abilities area of LyraRPGGameplayAbility. 30 symbols across 11 files."
---

# Abilities

30 symbols | 11 files | Cohesion: 97%

## When to Use

- Working with code in `Source/`
- Understanding how ULyraAbilityCost, ULyraAbilityCost_InventoryItem, ULyraAbilityCost_ItemTagStack work
- Modifying abilities-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `Source/LyraGame/AbilitySystem/Abilities/LyraGameplayAbility.cpp` | GetLyraAbilitySystemComponentFromActorInfo, SetCanBeCanceled, CanChangeActivationGroup, ChangeActivationGroup, GetLyraCharacterFromActorInfo (+8) |
| `Source/LyraGame/AbilitySystem/Abilities/LyraGameplayAbility_Death.cpp` | ActivateAbility, StartDeath, EndAbility, FinishDeath |
| `Source/LyraGame/AbilitySystem/Abilities/LyraGameplayAbility_Jump.cpp` | EndAbility, CharacterJumpStart, CharacterJumpStop |
| `Source/LyraGame/AbilitySystem/Abilities/LyraGameplayAbility.h` | OnAbilityFailedToActivate, NativeOnAbilityFailedToActivate, ScriptOnAbilityFailedToActivate |
| `Source/LyraGame/AbilitySystem/Abilities/LyraGameplayAbility_Reset.cpp` | ActivateAbility |
| `Source/LyraGame/AbilitySystem/Abilities/LyraAbilityCost.h` | ULyraAbilityCost |
| `Source/LyraGame/AbilitySystem/Abilities/LyraAbilityCost_InventoryItem.h` | ULyraAbilityCost_InventoryItem |
| `Source/LyraGame/AbilitySystem/Abilities/LyraAbilityCost_ItemTagStack.h` | ULyraAbilityCost_ItemTagStack |
| `Source/LyraGame/AbilitySystem/Abilities/LyraAbilityCost_PlayerTagStack.h` | ULyraAbilityCost_PlayerTagStack |
| `Source/LyraGame/AbilitySystem/LyraAbilitySystemComponent.cpp` | AddDynamicTagGameplayEffect |

## Entry Points

Start here when exploring this area:

- **`ULyraAbilityCost`** (Class) — `Source/LyraGame/AbilitySystem/Abilities/LyraAbilityCost.h:17`
- **`ULyraAbilityCost_InventoryItem`** (Class) — `Source/LyraGame/AbilitySystem/Abilities/LyraAbilityCost_InventoryItem.h:23`
- **`ULyraAbilityCost_ItemTagStack`** (Class) — `Source/LyraGame/AbilitySystem/Abilities/LyraAbilityCost_ItemTagStack.h:22`
- **`ULyraAbilityCost_PlayerTagStack`** (Class) — `Source/LyraGame/AbilitySystem/Abilities/LyraAbilityCost_PlayerTagStack.h:21`
- **`GetLyraAbilitySystemComponentFromActorInfo`** (Method) — `Source/LyraGame/AbilitySystem/Abilities/LyraGameplayAbility.cpp:51`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `ULyraAbilityCost` | Class | `Source/LyraGame/AbilitySystem/Abilities/LyraAbilityCost.h` | 17 |
| `ULyraAbilityCost_InventoryItem` | Class | `Source/LyraGame/AbilitySystem/Abilities/LyraAbilityCost_InventoryItem.h` | 23 |
| `ULyraAbilityCost_ItemTagStack` | Class | `Source/LyraGame/AbilitySystem/Abilities/LyraAbilityCost_ItemTagStack.h` | 22 |
| `ULyraAbilityCost_PlayerTagStack` | Class | `Source/LyraGame/AbilitySystem/Abilities/LyraAbilityCost_PlayerTagStack.h` | 21 |
| `GetLyraAbilitySystemComponentFromActorInfo` | Method | `Source/LyraGame/AbilitySystem/Abilities/LyraGameplayAbility.cpp` | 51 |
| `SetCanBeCanceled` | Method | `Source/LyraGame/AbilitySystem/Abilities/LyraGameplayAbility.cpp` | 161 |
| `CanChangeActivationGroup` | Method | `Source/LyraGame/AbilitySystem/Abilities/LyraGameplayAbility.cpp` | 466 |
| `ChangeActivationGroup` | Method | `Source/LyraGame/AbilitySystem/Abilities/LyraGameplayAbility.cpp` | 496 |
| `ActivateAbility` | Method | `Source/LyraGame/AbilitySystem/Abilities/LyraGameplayAbility_Death.cpp` | 31 |
| `StartDeath` | Method | `Source/LyraGame/AbilitySystem/Abilities/LyraGameplayAbility_Death.cpp` | 69 |
| `ActivateAbility` | Method | `Source/LyraGame/AbilitySystem/Abilities/LyraGameplayAbility_Reset.cpp` | 27 |
| `GetLyraCharacterFromActorInfo` | Method | `Source/LyraGame/AbilitySystem/Abilities/LyraGameplayAbility.cpp` | 91 |
| `EndAbility` | Method | `Source/LyraGame/AbilitySystem/Abilities/LyraGameplayAbility_Jump.cpp` | 40 |
| `CharacterJumpStart` | Method | `Source/LyraGame/AbilitySystem/Abilities/LyraGameplayAbility_Jump.cpp` | 48 |
| `CharacterJumpStop` | Method | `Source/LyraGame/AbilitySystem/Abilities/LyraGameplayAbility_Jump.cpp` | 60 |
| `GetHeroComponentFromActorInfo` | Method | `Source/LyraGame/AbilitySystem/Abilities/LyraGameplayAbility.cpp` | 96 |
| `EndAbility` | Method | `Source/LyraGame/AbilitySystem/Abilities/LyraGameplayAbility.cpp` | 194 |
| `SetCameraMode` | Method | `Source/LyraGame/AbilitySystem/Abilities/LyraGameplayAbility.cpp` | 519 |
| `ClearCameraMode` | Method | `Source/LyraGame/AbilitySystem/Abilities/LyraGameplayAbility.cpp` | 530 |
| `MakeEffectContext` | Method | `Source/LyraGame/AbilitySystem/Abilities/LyraGameplayAbility.cpp` | 277 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `ActivateAbility → GetLyraAbilitySystemComponentFromActorInfo` | intra_community | 4 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Messages | 1 calls |
| AbilitySystem | 1 calls |

## How to Explore

1. `context({name: "ULyraAbilityCost"})` — see callers and callees
2. `query({search_query: "abilities"})` — find related execution flows
3. Read key files listed above for implementation details
4. `explain({target: "<file or symbol>"})` — persisted taint findings (source→sink data flows), when indexed with `--pdg`
