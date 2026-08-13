---
name: system
description: "Skill for the System area of LyraRPGGameplayAbility. 27 symbols across 6 files."
---

# System

27 symbols | 6 files | Cohesion: 100%

## When to Use

- Working with code in `Source/`
- Understanding how ULyraAssetManager, GetClassNodeMapping, RegisterClassRepNodeMapping work
- Modifying system-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `Source/LyraGame/System/LyraReplicationGraph.cpp` | GetClassNodeMapping, RegisterClassRepNodeMapping, InitClassReplicationInfo, ConditionalInitClassReplicationInfo, AddClassRepInfo (+5) |
| `Source/LyraGame/System/LyraAssetManager.cpp` | StartInitialLoading, InitializeGameplayCueManager, DoAllStartupJobs, UpdateInitialGameContentLoadPercent, SynchronousLoadAsset (+1) |
| `Source/LyraGame/System/LyraAssetManager.h` | Get, SynchronousLoadAsset, GetAsset, GetSubclass, ULyraAssetManager (+1) |
| `Source/LyraGame/System/LyraDevelopmentStatics.cpp` | FindBlueprintClass, FindClassByShortName |
| `Source/LyraGame/System/LyraSystemStatics.cpp` | SetVectorParameterValueOnAllMeshComponents, SetColorParameterValueOnAllMeshComponents |
| `Source/LyraGame/System/LyraDevelopmentStatics.h` | GetAllBlueprints |

## Entry Points

Start here when exploring this area:

- **`ULyraAssetManager`** (Class) — `Source/LyraGame/System/LyraAssetManager.h:30`
- **`GetClassNodeMapping`** (Method) — `Source/LyraGame/System/LyraReplicationGraph.cpp:214`
- **`RegisterClassRepNodeMapping`** (Method) — `Source/LyraGame/System/LyraReplicationGraph.cpp:268`
- **`InitClassReplicationInfo`** (Method) — `Source/LyraGame/System/LyraReplicationGraph.cpp:274`
- **`ConditionalInitClassReplicationInfo`** (Method) — `Source/LyraGame/System/LyraReplicationGraph.cpp:294`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `ULyraAssetManager` | Class | `Source/LyraGame/System/LyraAssetManager.h` | 30 |
| `GetClassNodeMapping` | Method | `Source/LyraGame/System/LyraReplicationGraph.cpp` | 214 |
| `RegisterClassRepNodeMapping` | Method | `Source/LyraGame/System/LyraReplicationGraph.cpp` | 268 |
| `InitClassReplicationInfo` | Method | `Source/LyraGame/System/LyraReplicationGraph.cpp` | 274 |
| `ConditionalInitClassReplicationInfo` | Method | `Source/LyraGame/System/LyraReplicationGraph.cpp` | 294 |
| `AddClassRepInfo` | Method | `Source/LyraGame/System/LyraReplicationGraph.cpp` | 306 |
| `RegisterClassReplicationInfo` | Method | `Source/LyraGame/System/LyraReplicationGraph.cpp` | 319 |
| `InitGlobalActorClassSettings` | Method | `Source/LyraGame/System/LyraReplicationGraph.cpp` | 329 |
| `StartInitialLoading` | Method | `Source/LyraGame/System/LyraAssetManager.cpp` | 105 |
| `InitializeGameplayCueManager` | Method | `Source/LyraGame/System/LyraAssetManager.cpp` | 123 |
| `DoAllStartupJobs` | Method | `Source/LyraGame/System/LyraAssetManager.cpp` | 192 |
| `UpdateInitialGameContentLoadPercent` | Method | `Source/LyraGame/System/LyraAssetManager.cpp` | 247 |
| `Get` | Method | `Source/LyraGame/System/LyraAssetManager.h` | 39 |
| `SynchronousLoadAsset` | Method | `Source/LyraGame/System/LyraAssetManager.h` | 69 |
| `GetAsset` | Method | `Source/LyraGame/System/LyraAssetManager.h` | 123 |
| `GetSubclass` | Method | `Source/LyraGame/System/LyraAssetManager.h` | 149 |
| `FindBlueprintClass` | Method | `Source/LyraGame/System/LyraDevelopmentStatics.cpp` | 103 |
| `FindClassByShortName` | Method | `Source/LyraGame/System/LyraDevelopmentStatics.cpp` | 129 |
| `GetAllBlueprints` | Method | `Source/LyraGame/System/LyraDevelopmentStatics.h` | 50 |
| `GetMappingPolicy` | Method | `Source/LyraGame/System/LyraReplicationGraph.cpp` | 581 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `InitGlobalActorClassSettings → GetClassNodeMapping` | intra_community | 3 |
| `InitGlobalActorClassSettings → InitClassReplicationInfo` | intra_community | 3 |

## How to Explore

1. `context({name: "ULyraAssetManager"})` — see callers and callees
2. `query({search_query: "system"})` — find related execution flows
3. Read key files listed above for implementation details
4. `explain({target: "<file or symbol>"})` — persisted taint findings (source→sink data flows), when indexed with `--pdg`
