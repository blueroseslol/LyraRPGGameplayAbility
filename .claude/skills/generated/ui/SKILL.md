---
name: ui
description: "Skill for the UI area of LyraRPGGameplayAbility. 26 symbols across 10 files."
---

# UI

26 symbols | 10 files | Cohesion: 89%

## When to Use

- Working with code in `Source/`
- Understanding how UGameResponsivePanel, ULyraBrightnessEditor, ULyraSafeZoneEditor work
- Modifying ui-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `Source/LyraGame/UI/LyraSimulatedInputWidget.cpp` | NativeOnTouchEnded, GetPlayerInput, InputKeyValue, InputKeyValue2D, FlushSimulatedInput (+5) |
| `Source/LyraGame/UI/LyraJoystickWidget.cpp` | NativeTick, NativeOnTouchEnded, NativeOnMouseLeave, StopInputSimulation, NativeOnTouchMoved (+1) |
| `Source/LyraGame/UI/LyraTaggedWidget.cpp` | NativeConstruct, SetVisibility, OnWatchedTagsChanged |
| `Plugins/GameSettings/Source/Private/Widgets/Responsive/GameResponsivePanel.cpp` | UGameResponsivePanel |
| `Source/LyraGame/Settings/Screens/LyraBrightnessEditor.cpp` | ULyraBrightnessEditor |
| `Source/LyraGame/Settings/Screens/LyraSafeZoneEditor.cpp` | ULyraSafeZoneEditor |
| `Source/LyraGame/UI/IndicatorSystem/IndicatorLayer.cpp` | UIndicatorLayer |
| `Source/LyraGame/UI/Weapons/CircumferenceMarkerWidget.cpp` | UCircumferenceMarkerWidget |
| `Source/LyraGame/UI/Weapons/HitMarkerConfirmationWidget.cpp` | UHitMarkerConfirmationWidget |
| `Source/LyraGame/UI/LyraTouchRegion.cpp` | NativeTick |

## Entry Points

Start here when exploring this area:

- **`UGameResponsivePanel`** (Method) — `Plugins/GameSettings/Source/Private/Widgets/Responsive/GameResponsivePanel.cpp:13`
- **`ULyraBrightnessEditor`** (Method) — `Source/LyraGame/Settings/Screens/LyraBrightnessEditor.cpp:23`
- **`ULyraSafeZoneEditor`** (Method) — `Source/LyraGame/Settings/Screens/LyraSafeZoneEditor.cpp:23`
- **`UIndicatorLayer`** (Method) — `Source/LyraGame/UI/IndicatorSystem/IndicatorLayer.cpp:14`
- **`NativeConstruct`** (Method) — `Source/LyraGame/UI/LyraTaggedWidget.cpp:13`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `UGameResponsivePanel` | Method | `Plugins/GameSettings/Source/Private/Widgets/Responsive/GameResponsivePanel.cpp` | 13 |
| `ULyraBrightnessEditor` | Method | `Source/LyraGame/Settings/Screens/LyraBrightnessEditor.cpp` | 23 |
| `ULyraSafeZoneEditor` | Method | `Source/LyraGame/Settings/Screens/LyraSafeZoneEditor.cpp` | 23 |
| `UIndicatorLayer` | Method | `Source/LyraGame/UI/IndicatorSystem/IndicatorLayer.cpp` | 14 |
| `NativeConstruct` | Method | `Source/LyraGame/UI/LyraTaggedWidget.cpp` | 13 |
| `SetVisibility` | Method | `Source/LyraGame/UI/LyraTaggedWidget.cpp` | 37 |
| `OnWatchedTagsChanged` | Method | `Source/LyraGame/UI/LyraTaggedWidget.cpp` | 69 |
| `UCircumferenceMarkerWidget` | Method | `Source/LyraGame/UI/Weapons/CircumferenceMarkerWidget.cpp` | 9 |
| `UHitMarkerConfirmationWidget` | Method | `Source/LyraGame/UI/Weapons/HitMarkerConfirmationWidget.cpp` | 11 |
| `NativeTick` | Method | `Source/LyraGame/UI/LyraJoystickWidget.cpp` | 56 |
| `NativeOnTouchEnded` | Method | `Source/LyraGame/UI/LyraSimulatedInputWidget.cpp` | 48 |
| `GetPlayerInput` | Method | `Source/LyraGame/UI/LyraSimulatedInputWidget.cpp` | 67 |
| `InputKeyValue` | Method | `Source/LyraGame/UI/LyraSimulatedInputWidget.cpp` | 76 |
| `InputKeyValue2D` | Method | `Source/LyraGame/UI/LyraSimulatedInputWidget.cpp` | 135 |
| `FlushSimulatedInput` | Method | `Source/LyraGame/UI/LyraSimulatedInputWidget.cpp` | 140 |
| `NativeTick` | Method | `Source/LyraGame/UI/LyraTouchRegion.cpp` | 31 |
| `NativeConstruct` | Method | `Source/LyraGame/UI/LyraSimulatedInputWidget.cpp` | 25 |
| `NativeDestruct` | Method | `Source/LyraGame/UI/LyraSimulatedInputWidget.cpp` | 38 |
| `GetEnhancedInputSubsystem` | Method | `Source/LyraGame/UI/LyraSimulatedInputWidget.cpp` | 55 |
| `QueryKeyToSimulate` | Method | `Source/LyraGame/UI/LyraSimulatedInputWidget.cpp` | 148 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `NativePreConstruct → SetVisibility` | cross_community | 3 |

## How to Explore

1. `context({name: "UGameResponsivePanel"})` — see callers and callees
2. `query({search_query: "ui"})` — find related execution flows
3. Read key files listed above for implementation details
4. `explain({target: "<file or symbol>"})` — persisted taint findings (source→sink data flows), when indexed with `--pdg`
