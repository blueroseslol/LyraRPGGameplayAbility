---
name: cosmetics
description: "Skill for the Cosmetics area of LyraRPGGameplayAbility. 38 symbols across 6 files."
---

# Cosmetics

38 symbols | 6 files | Cohesion: 85%

## When to Use

- Working with code in `Source/`
- Understanding how BeginPlay, EndPlay, GetPawnCustomizer work
- Modifying cosmetics-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `Source/LyraGame/Cosmetics/LyraPawnComponent_CharacterParts.cpp` | PreReplicatedRemove, PostReplicatedChange, RemoveEntry, ClearAllEntries, CollectCombinedTags (+10) |
| `Source/LyraGame/Cosmetics/LyraControllerComponent_CharacterParts.cpp` | BeginPlay, EndPlay, GetPawnCustomizer, AddCharacterPart, AddCharacterPartInternal (+7) |
| `Source/LyraGame/Cosmetics/LyraCosmeticDeveloperSettings.cpp` | PostEditChangeProperty, PostReloadConfig, PostInitProperties, ApplySettings, ReapplyLoadoutIfInPIE |
| `Source/LyraGame/Cosmetics/LyraCosmeticCheats.cpp` | AddCharacterPart, ReplaceCharacterPart, ClearCharacterPartOverrides, GetCosmeticComponent |
| `Source/LyraGame/Cosmetics/LyraCharacterPartTypes.h` | AreEquivalentParts |
| `Source/LyraGame/System/LyraDevelopmentStatics.h` | FindPlayInEditorAuthorityWorld |

## Entry Points

Start here when exploring this area:

- **`BeginPlay`** (Method) — `Source/LyraGame/Cosmetics/LyraControllerComponent_CharacterParts.cpp:18`
- **`EndPlay`** (Method) — `Source/LyraGame/Cosmetics/LyraControllerComponent_CharacterParts.cpp:39`
- **`GetPawnCustomizer`** (Method) — `Source/LyraGame/Cosmetics/LyraControllerComponent_CharacterParts.cpp:45`
- **`AddCharacterPart`** (Method) — `Source/LyraGame/Cosmetics/LyraControllerComponent_CharacterParts.cpp:54`
- **`AddCharacterPartInternal`** (Method) — `Source/LyraGame/Cosmetics/LyraControllerComponent_CharacterParts.cpp:59`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `BeginPlay` | Method | `Source/LyraGame/Cosmetics/LyraControllerComponent_CharacterParts.cpp` | 18 |
| `EndPlay` | Method | `Source/LyraGame/Cosmetics/LyraControllerComponent_CharacterParts.cpp` | 39 |
| `GetPawnCustomizer` | Method | `Source/LyraGame/Cosmetics/LyraControllerComponent_CharacterParts.cpp` | 45 |
| `AddCharacterPart` | Method | `Source/LyraGame/Cosmetics/LyraControllerComponent_CharacterParts.cpp` | 54 |
| `AddCharacterPartInternal` | Method | `Source/LyraGame/Cosmetics/LyraControllerComponent_CharacterParts.cpp` | 59 |
| `RemoveCharacterPart` | Method | `Source/LyraGame/Cosmetics/LyraControllerComponent_CharacterParts.cpp` | 75 |
| `RemoveAllCharacterParts` | Method | `Source/LyraGame/Cosmetics/LyraControllerComponent_CharacterParts.cpp` | 92 |
| `OnPossessedPawnChanged` | Method | `Source/LyraGame/Cosmetics/LyraControllerComponent_CharacterParts.cpp` | 105 |
| `ApplyDeveloperSettings` | Method | `Source/LyraGame/Cosmetics/LyraControllerComponent_CharacterParts.cpp` | 131 |
| `AddCheatPart` | Method | `Source/LyraGame/Cosmetics/LyraControllerComponent_CharacterParts.cpp` | 163 |
| `ClearCheatParts` | Method | `Source/LyraGame/Cosmetics/LyraControllerComponent_CharacterParts.cpp` | 171 |
| `SetSuppressionOnNaturalParts` | Method | `Source/LyraGame/Cosmetics/LyraControllerComponent_CharacterParts.cpp` | 193 |
| `PreReplicatedRemove` | Method | `Source/LyraGame/Cosmetics/LyraPawnComponent_CharacterParts.cpp` | 26 |
| `PostReplicatedChange` | Method | `Source/LyraGame/Cosmetics/LyraPawnComponent_CharacterParts.cpp` | 56 |
| `RemoveEntry` | Method | `Source/LyraGame/Cosmetics/LyraPawnComponent_CharacterParts.cpp` | 97 |
| `ClearAllEntries` | Method | `Source/LyraGame/Cosmetics/LyraPawnComponent_CharacterParts.cpp` | 118 |
| `CollectCombinedTags` | Method | `Source/LyraGame/Cosmetics/LyraPawnComponent_CharacterParts.cpp` | 134 |
| `DestroyActorForEntry` | Method | `Source/LyraGame/Cosmetics/LyraPawnComponent_CharacterParts.cpp` | 201 |
| `RemoveCharacterPart` | Method | `Source/LyraGame/Cosmetics/LyraPawnComponent_CharacterParts.cpp` | 235 |
| `GetCombinedTags` | Method | `Source/LyraGame/Cosmetics/LyraPawnComponent_CharacterParts.cpp` | 318 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `BeginPlay → GetPawn` | cross_community | 5 |
| `ClearCheatParts → GetPawn` | cross_community | 5 |
| `ReplaceCharacterPart → FindGameWorld` | cross_community | 5 |
| `PostReplicatedChange → Reset` | cross_community | 4 |
| `PostReplicatedChange → GetParentMeshComponent` | cross_community | 4 |
| `PostReplicatedChange → CollectCombinedTags` | intra_community | 4 |
| `PreReplicatedRemove → CollectCombinedTags` | intra_community | 4 |
| `PostReplicatedAdd → Reset` | cross_community | 4 |
| `PostReplicatedAdd → GetParentMeshComponent` | intra_community | 4 |
| `PostReplicatedAdd → CollectCombinedTags` | cross_community | 4 |

## Connected Areas

| Area | Connections |
|------|-------------|
| GameFeatures | 7 calls |
| Character | 2 calls |
| Tests | 1 calls |

## How to Explore

1. `context({name: "BeginPlay"})` — see callers and callees
2. `query({search_query: "cosmetics"})` — find related execution flows
3. Read key files listed above for implementation details
4. `explain({target: "<file or symbol>"})` — persisted taint findings (source→sink data flows), when indexed with `--pdg`
