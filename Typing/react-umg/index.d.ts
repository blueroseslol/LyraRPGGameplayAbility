declare module "react-umg" {
    import * as React from 'react';
    import * as UE from 'ue';
    import * as cpp from 'cpp';
    type TArray<T> = UE.TArray<T>;
    type TSet<T> = UE.TSet<T>;
    type TMap<TKey, TValue> = UE.TMap<TKey, TValue>;

    type RecursivePartial<T> = {
        [P in keyof T]?:
        T[P] extends (infer U)[] ? RecursivePartial<U>[] :
        T[P] extends object ? RecursivePartial<T[P]> :
        T[P];
    };

    interface PanelSlot {
    }

    interface BackgroundBlurSlot extends PanelSlot {
        Padding?: RecursivePartial<UE.Margin>;
        HorizontalAlignment?: UE.EHorizontalAlignment;
        VerticalAlignment?: UE.EVerticalAlignment;
    }

    interface BorderSlot extends PanelSlot {
        Padding?: RecursivePartial<UE.Margin>;
        HorizontalAlignment?: UE.EHorizontalAlignment;
        VerticalAlignment?: UE.EVerticalAlignment;
    }

    interface ButtonSlot extends PanelSlot {
        Padding?: RecursivePartial<UE.Margin>;
        HorizontalAlignment?: UE.EHorizontalAlignment;
        VerticalAlignment?: UE.EVerticalAlignment;
    }

    interface CanvasPanelSlot extends PanelSlot {
        LayoutData?: RecursivePartial<UE.AnchorData>;
        bAutoSize?: boolean;
        ZOrder?: number;
    }

    interface GridSlot extends PanelSlot {
        Padding?: RecursivePartial<UE.Margin>;
        HorizontalAlignment?: UE.EHorizontalAlignment;
        VerticalAlignment?: UE.EVerticalAlignment;
        Row?: number;
        RowSpan?: number;
        Column?: number;
        ColumnSpan?: number;
        Layer?: number;
        Nudge?: RecursivePartial<UE.Vector2D>;
    }

    interface HorizontalBoxSlot extends PanelSlot {
        Size?: RecursivePartial<UE.SlateChildSize>;
        Padding?: RecursivePartial<UE.Margin>;
        HorizontalAlignment?: UE.EHorizontalAlignment;
        VerticalAlignment?: UE.EVerticalAlignment;
    }

    interface OverlaySlot extends PanelSlot {
        Padding?: RecursivePartial<UE.Margin>;
        HorizontalAlignment?: UE.EHorizontalAlignment;
        VerticalAlignment?: UE.EVerticalAlignment;
    }

    interface SafeZoneSlot extends PanelSlot {
        bIsTitleSafe?: boolean;
        SafeAreaScale?: RecursivePartial<UE.Margin>;
        HAlign?: UE.EHorizontalAlignment;
        VAlign?: UE.EVerticalAlignment;
        Padding?: RecursivePartial<UE.Margin>;
    }

    interface ScaleBoxSlot extends PanelSlot {
        Padding?: RecursivePartial<UE.Margin>;
        HorizontalAlignment?: UE.EHorizontalAlignment;
        VerticalAlignment?: UE.EVerticalAlignment;
    }

    interface ScrollBoxSlot extends PanelSlot {
        Size?: RecursivePartial<UE.SlateChildSize>;
        Padding?: RecursivePartial<UE.Margin>;
        HorizontalAlignment?: UE.EHorizontalAlignment;
        VerticalAlignment?: UE.EVerticalAlignment;
    }

    interface SizeBoxSlot extends PanelSlot {
        Padding?: RecursivePartial<UE.Margin>;
        HorizontalAlignment?: UE.EHorizontalAlignment;
        VerticalAlignment?: UE.EVerticalAlignment;
    }

    interface StackBoxSlot extends PanelSlot {
        Padding?: RecursivePartial<UE.Margin>;
        Size?: RecursivePartial<UE.SlateChildSize>;
        HorizontalAlignment?: UE.EHorizontalAlignment;
        VerticalAlignment?: UE.EVerticalAlignment;
    }

    interface UniformGridSlot extends PanelSlot {
        HorizontalAlignment?: UE.EHorizontalAlignment;
        VerticalAlignment?: UE.EVerticalAlignment;
        Row?: number;
        Column?: number;
    }

    interface VerticalBoxSlot extends PanelSlot {
        Size?: RecursivePartial<UE.SlateChildSize>;
        Padding?: RecursivePartial<UE.Margin>;
        HorizontalAlignment?: UE.EHorizontalAlignment;
        VerticalAlignment?: UE.EVerticalAlignment;
    }

    interface WidgetSwitcherSlot extends PanelSlot {
        Padding?: RecursivePartial<UE.Margin>;
        HorizontalAlignment?: UE.EHorizontalAlignment;
        VerticalAlignment?: UE.EVerticalAlignment;
    }

    interface WindowTitleBarAreaSlot extends PanelSlot {
        Padding?: RecursivePartial<UE.Margin>;
        HorizontalAlignment?: UE.EHorizontalAlignment;
        VerticalAlignment?: UE.EVerticalAlignment;
    }

    interface WrapBoxSlot extends PanelSlot {
        Padding?: RecursivePartial<UE.Margin>;
        FillSpanWhenLessThan?: number;
        HorizontalAlignment?: UE.EHorizontalAlignment;
        VerticalAlignment?: UE.EVerticalAlignment;
        bFillEmptySpace?: boolean;
        bForceNewLine?: boolean;
    }

    interface LoadGuardSlot extends PanelSlot {
        Padding?: RecursivePartial<UE.Margin>;
        HorizontalAlignment?: UE.EHorizontalAlignment;
        VerticalAlignment?: UE.EVerticalAlignment;
    }

    interface CommonVisibilitySwitcherSlot extends OverlaySlot {
    }

    interface GameResponsivePanelSlot extends PanelSlot {
    }

    export interface Props {
        Slot ? : PanelSlot;
    }

    interface WidgetProps extends Props {
        bIsEnabledDelegate?: () => boolean;
        ToolTipTextDelegate?: () => string;
        ToolTipText?: string;
        VisibilityDelegate?: () => UE.ESlateVisibility;
        RenderTransform?: RecursivePartial<UE.WidgetTransform>;
        RenderTransformPivot?: RecursivePartial<UE.Vector2D>;
        FlowDirectionPreference?: UE.EFlowDirectionPreference;
        bIsVariable?: boolean;
        bCreatedByConstructionScript?: boolean;
        bIsEnabled?: boolean;
        bOverride_Cursor?: boolean;
        bOverrideAccessibleDefaults?: boolean;
        bCanChildrenBeAccessible?: boolean;
        AccessibleBehavior?: UE.ESlateAccessibleBehavior;
        AccessibleSummaryBehavior?: UE.ESlateAccessibleBehavior;
        AccessibleText?: string;
        AccessibleTextDelegate?: () => string;
        AccessibleSummaryText?: string;
        AccessibleSummaryTextDelegate?: () => string;
        bIsVolatile?: boolean;
        bWrappedByComponent?: boolean;
        bHiddenInDesigner?: boolean;
        bExpandedInDesigner?: boolean;
        bLockedInDesigner?: boolean;
        Cursor?: UE.EMouseCursor;
        Clipping?: UE.EWidgetClipping;
        Visibility?: UE.ESlateVisibility;
        PixelSnapping?: UE.EWidgetPixelSnapping;
        RenderOpacity?: number;
        DesignerFlags?: number;
        DisplayLabel?: string;
        CategoryName?: string;
    }

    class Widget extends React.Component<WidgetProps> {
        nativePtr: UE.Widget;
    }

    interface UserWidgetProps extends WidgetProps {
        ColorAndOpacity?: RecursivePartial<UE.LinearColor>;
        ColorAndOpacityDelegate?: () => UE.LinearColor;
        ForegroundColor?: RecursivePartial<UE.SlateColor>;
        ForegroundColorDelegate?: () => UE.SlateColor;
        OnVisibilityChanged?: (InVisibility: UE.ESlateVisibility) => void;
        Padding?: RecursivePartial<UE.Margin>;
        Priority?: number;
        bIsFocusable?: boolean;
        bStopAction?: boolean;
        bAutomaticallyRegisterInputOnConstruction?: boolean;
        QueuedWidgetAnimationTransitions?: TArray<UE.QueuedWidgetAnimationTransition>;
        NamedSlotBindings?: TArray<UE.NamedSlotBinding>;
        DesignTimeSize?: RecursivePartial<UE.Vector2D>;
        DesignSizeMode?: UE.EDesignPreviewSizeMode;
        PaletteCategory?: string;
        bHasScriptImplementedTick?: boolean;
        bHasScriptImplementedPaint?: boolean;
        TickFrequency?: UE.EWidgetTickFrequency;
        DesiredFocusWidget?: RecursivePartial<UE.WidgetChild>;
        AnimationCallbacks?: TArray<UE.AnimationEventBinding>;
    }

    class UserWidget extends React.Component<UserWidgetProps> {
        nativePtr: UE.UserWidget;
    }

    interface VREditorBaseUserWidgetProps extends UserWidgetProps {
    }

    class VREditorBaseUserWidget extends React.Component<VREditorBaseUserWidgetProps> {
        nativePtr: UE.VREditorBaseUserWidget;
    }

    interface RadialSliderProps extends WidgetProps {
        Value?: number;
        ValueDelegate?: () => number;
        bUseCustomDefaultValue?: boolean;
        CustomDefaultValue?: number;
        SliderRange?: RecursivePartial<UE.RuntimeFloatCurve>;
        ValueTags?: TArray<number>;
        SliderHandleStartAngle?: number;
        SliderHandleEndAngle?: number;
        AngularOffset?: number;
        HandStartEndRatio?: RecursivePartial<UE.Vector2D>;
        WidgetStyle?: RecursivePartial<UE.SliderStyle>;
        SliderBarColor?: RecursivePartial<UE.LinearColor>;
        SliderProgressColor?: RecursivePartial<UE.LinearColor>;
        SliderHandleColor?: RecursivePartial<UE.LinearColor>;
        CenterBackgroundColor?: RecursivePartial<UE.LinearColor>;
        Locked?: boolean;
        MouseUsesStep?: boolean;
        RequiresControllerLock?: boolean;
        StepSize?: number;
        IsFocusable?: boolean;
        UseVerticalDrag?: boolean;
        ShowSliderHandle?: boolean;
        ShowSliderHand?: boolean;
        OnMouseCaptureBegin?: () => void;
        OnMouseCaptureEnd?: () => void;
        OnControllerCaptureBegin?: () => void;
        OnControllerCaptureEnd?: () => void;
        OnValueChanged?: (Value: number) => void;
    }

    class RadialSlider extends React.Component<RadialSliderProps> {
        nativePtr: UE.RadialSlider;
    }

    interface ListViewBaseProps extends WidgetProps {
        BP_OnEntriesGenerated?: (NumEntries: number) => void;
        WheelScrollMultiplier?: number;
        bEnableScrollAnimation?: boolean;
        ScrollingAnimationInterpolationSpeed?: number;
        bInEnableTouchAnimatedScrolling?: boolean;
        AllowOverscroll?: boolean;
        bEnableRightClickScrolling?: boolean;
        bEnableTouchScrolling?: boolean;
        bIsPointerScrollingEnabled?: boolean;
        bIsGamepadScrollingEnabled?: boolean;
        bEnableFixedLineOffset?: boolean;
        FixedLineScrollOffset?: number;
        bAllowDragging?: boolean;
        bAllowDragDrop?: boolean;
        DragDropVisualPivot?: UE.EDragPivot;
        DragDropVisualOffset?: RecursivePartial<UE.Vector2D>;
        bIsDragging?: boolean;
        bSelectItemOnNavigation?: boolean;
        bAllowKeepPreselectedItems?: boolean;
        NumDesignerPreviewEntries?: number;
        EntryWidgetPool?: RecursivePartial<UE.UserWidgetPool>;
    }

    class ListViewBase extends React.Component<ListViewBaseProps> {
        nativePtr: UE.ListViewBase;
    }

    interface ListViewProps extends ListViewBaseProps {
        WidgetStyle?: RecursivePartial<UE.TableViewStyle>;
        ScrollBarStyle?: RecursivePartial<UE.ScrollBarStyle>;
        bEnableShadowBrush?: boolean;
        ShadowBrushStyle?: RecursivePartial<UE.ScrollBoxStyle>;
        Orientation?: UE.EOrientation;
        SelectionMode?: UE.ESelectionMode;
        ConsumeMouseWheel?: UE.EConsumeMouseWheel;
        bClearSelectionOnClick?: boolean;
        bIsFocusable?: boolean;
        bClearScrollVelocityOnSelection?: boolean;
        bReturnFocusToSelection?: boolean;
        bEnableProximateEntryNavigation?: boolean;
        ScrollIntoViewAlignment?: UE.EScrollIntoViewAlignment;
        EntrySpacing?: number;
        HorizontalEntrySpacing?: number;
        VerticalEntrySpacing?: number;
        ScrollBarPadding?: RecursivePartial<UE.Margin>;
        BP_OnListViewDraggingStateChanged?: (bIsDragging: boolean) => void;
        BP_OnListViewScrolled?: (ItemOffset: number, DistanceRemaining: number) => void;
        BP_OnListViewFinishedScrolling?: () => void;
        BP_OnListViewTouchStart?: () => void;
        BP_OnListViewTouchMove?: () => void;
        BP_OnListViewTouchEnd?: () => void;
    }

    class ListView extends React.Component<ListViewProps> {
        nativePtr: UE.ListView;
    }

    interface PanelWidgetProps extends WidgetProps {
    }

    class PanelWidget extends React.Component<PanelWidgetProps> {
        nativePtr: UE.PanelWidget;
    }

    interface ContentWidgetProps extends PanelWidgetProps {
    }

    class ContentWidget extends React.Component<ContentWidgetProps> {
        nativePtr: UE.ContentWidget;
    }

    interface BackgroundBlurProps extends ContentWidgetProps {
        Padding?: RecursivePartial<UE.Margin>;
        HorizontalAlignment?: UE.EHorizontalAlignment;
        VerticalAlignment?: UE.EVerticalAlignment;
        bApplyAlphaToBlur?: boolean;
        BlurStrength?: number;
        bOverrideAutoRadiusCalculation?: boolean;
        BlurRadius?: number;
        CornerRadius?: RecursivePartial<UE.Vector4>;
        LowQualityFallbackBrush?: RecursivePartial<UE.SlateBrush>;
    }

    class BackgroundBlur extends React.Component<BackgroundBlurProps> {
        nativePtr: UE.BackgroundBlur;
    }

    interface BorderProps extends ContentWidgetProps {
        HorizontalAlignment?: UE.EHorizontalAlignment;
        VerticalAlignment?: UE.EVerticalAlignment;
        bShowEffectWhenDisabled?: boolean;
        ContentColorAndOpacity?: RecursivePartial<UE.LinearColor>;
        ContentColorAndOpacityDelegate?: () => UE.LinearColor;
        Padding?: RecursivePartial<UE.Margin>;
        Background?: RecursivePartial<UE.SlateBrush>;
        BackgroundDelegate?: () => UE.SlateBrush;
        BrushColor?: RecursivePartial<UE.LinearColor>;
        BrushColorDelegate?: () => UE.LinearColor;
        DesiredSizeScale?: RecursivePartial<UE.Vector2D>;
        bFlipForRightToLeftFlowDirection?: boolean;
        OnMouseButtonDownEvent?: (MyGeometry: UE.Geometry, MouseEvent: UE.PointerEvent) => UE.EventReply;
        OnMouseButtonUpEvent?: (MyGeometry: UE.Geometry, MouseEvent: UE.PointerEvent) => UE.EventReply;
        OnMouseMoveEvent?: (MyGeometry: UE.Geometry, MouseEvent: UE.PointerEvent) => UE.EventReply;
        OnMouseDoubleClickEvent?: (MyGeometry: UE.Geometry, MouseEvent: UE.PointerEvent) => UE.EventReply;
    }

    class Border extends React.Component<BorderProps> {
        nativePtr: UE.Border;
    }

    interface ButtonProps extends ContentWidgetProps {
        WidgetStyle?: RecursivePartial<UE.ButtonStyle>;
        ColorAndOpacity?: RecursivePartial<UE.LinearColor>;
        BackgroundColor?: RecursivePartial<UE.LinearColor>;
        ClickMethod?: UE.EButtonClickMethod;
        TouchMethod?: UE.EButtonTouchMethod;
        PressMethod?: UE.EButtonPressMethod;
        IsFocusable?: boolean;
        OnClicked?: () => void;
        OnPressed?: () => void;
        OnReleased?: () => void;
        OnHovered?: () => void;
        OnUnhovered?: () => void;
        bAllowDragDrop?: boolean;
    }

    class Button extends React.Component<ButtonProps> {
        nativePtr: UE.Button;
    }

    interface CanvasPanelProps extends PanelWidgetProps {
    }

    class CanvasPanel extends React.Component<CanvasPanelProps> {
        nativePtr: UE.CanvasPanel;
    }

    interface CheckBoxProps extends ContentWidgetProps {
        CheckedState?: UE.ECheckBoxState;
        CheckedStateDelegate?: () => UE.ECheckBoxState;
        WidgetStyle?: RecursivePartial<UE.CheckBoxStyle>;
        HorizontalAlignment?: UE.EHorizontalAlignment;
        ClickMethod?: UE.EButtonClickMethod;
        TouchMethod?: UE.EButtonTouchMethod;
        PressMethod?: UE.EButtonPressMethod;
        IsFocusable?: boolean;
        OnCheckStateChanged?: (bIsChecked: boolean) => void;
    }

    class CheckBox extends React.Component<CheckBoxProps> {
        nativePtr: UE.CheckBox;
    }

    interface CircularThrobberProps extends WidgetProps {
        NumberOfPieces?: number;
        Period?: number;
        Radius?: number;
        Image?: RecursivePartial<UE.SlateBrush>;
        bEnableRadius?: boolean;
    }

    class CircularThrobber extends React.Component<CircularThrobberProps> {
        nativePtr: UE.CircularThrobber;
    }

    interface ComboBoxProps extends WidgetProps {
        ScrollBarStyle?: RecursivePartial<UE.ScrollBarStyle>;
        bIsFocusable?: boolean;
    }

    class ComboBox extends React.Component<ComboBoxProps> {
        nativePtr: UE.ComboBox;
    }

    interface ComboBoxKeyProps extends WidgetProps {
        Options?: TArray<string>;
        SelectedOption?: string;
        WidgetStyle?: RecursivePartial<UE.ComboBoxStyle>;
        ItemStyle?: RecursivePartial<UE.TableRowStyle>;
        ScrollBarStyle?: RecursivePartial<UE.ScrollBarStyle>;
        ForegroundColor?: RecursivePartial<UE.SlateColor>;
        ContentPadding?: RecursivePartial<UE.Margin>;
        MaxListHeight?: number;
        bHasDownArrow?: boolean;
        bEnableGamepadNavigationMode?: boolean;
        bIsFocusable?: boolean;
        OnSelectionChanged?: (SelectedItem: string, SelectionType: UE.ESelectInfo) => void;
        OnOpening?: () => void;
    }

    class ComboBoxKey extends React.Component<ComboBoxKeyProps> {
        nativePtr: UE.ComboBoxKey;
    }

    interface ComboBoxStringProps extends WidgetProps {
        DefaultOptions?: TArray<string>;
        SelectedOption?: string;
        WidgetStyle?: RecursivePartial<UE.ComboBoxStyle>;
        ItemStyle?: RecursivePartial<UE.TableRowStyle>;
        ScrollBarStyle?: RecursivePartial<UE.ScrollBarStyle>;
        ContentPadding?: RecursivePartial<UE.Margin>;
        MaxListHeight?: number;
        HasDownArrow?: boolean;
        EnableGamepadNavigationMode?: boolean;
        Font?: RecursivePartial<UE.SlateFontInfo>;
        ForegroundColor?: RecursivePartial<UE.SlateColor>;
        bIsFocusable?: boolean;
        OnSelectionChanged?: (SelectedItem: string, SelectionType: UE.ESelectInfo) => void;
        OnOpening?: () => void;
    }

    class ComboBoxString extends React.Component<ComboBoxStringProps> {
        nativePtr: UE.ComboBoxString;
    }

    interface DynamicEntryBoxBaseProps extends WidgetProps {
        EntrySpacing?: RecursivePartial<UE.Vector2D>;
        SpacingPattern?: TArray<UE.Vector2D>;
        EntryBoxType?: UE.EDynamicBoxType;
        EntrySizeRule?: RecursivePartial<UE.SlateChildSize>;
        EntryHorizontalAlignment?: UE.EHorizontalAlignment;
        EntryVerticalAlignment?: UE.EVerticalAlignment;
        MaxElementSize?: number;
        RadialBoxSettings?: RecursivePartial<UE.RadialBoxSettings>;
        EntryWidgetPool?: RecursivePartial<UE.UserWidgetPool>;
    }

    class DynamicEntryBoxBase extends React.Component<DynamicEntryBoxBaseProps> {
        nativePtr: UE.DynamicEntryBoxBase;
    }

    interface DynamicEntryBoxProps extends DynamicEntryBoxBaseProps {
        NumDesignerPreviewEntries?: number;
    }

    class DynamicEntryBox extends React.Component<DynamicEntryBoxProps> {
        nativePtr: UE.DynamicEntryBox;
    }

    interface EditableTextProps extends WidgetProps {
        Text?: string;
        TextDelegate?: () => string;
        HintText?: string;
        HintTextDelegate?: () => string;
        WidgetStyle?: RecursivePartial<UE.EditableTextStyle>;
        IsReadOnly?: boolean;
        IsPassword?: boolean;
        MinimumDesiredWidth?: number;
        IsCaretMovedWhenGainFocus?: boolean;
        SelectAllTextWhenFocused?: boolean;
        RevertTextOnEscape?: boolean;
        ClearKeyboardFocusOnCommit?: boolean;
        SelectAllTextOnCommit?: boolean;
        AllowContextMenu?: boolean;
        KeyboardType?: UE.EVirtualKeyboardType;
        VirtualKeyboardOptions?: RecursivePartial<UE.VirtualKeyboardOptions>;
        VirtualKeyboardTrigger?: UE.EVirtualKeyboardTrigger;
        VirtualKeyboardDismissAction?: UE.EVirtualKeyboardDismissAction;
        Justification?: UE.ETextJustify;
        OverflowPolicy?: UE.ETextOverflowPolicy;
        ShapedTextOptions?: RecursivePartial<UE.ShapedTextOptions>;
        OnTextChanged?: (Text: string) => void;
        OnTextCommitted?: (Text: string, CommitMethod: UE.ETextCommit) => void;
        EnableIntegratedKeyboard?: boolean;
        FontFacesLoadingPaintPolicy?: UE.EFontFacesLoadingPaintPolicy;
        OnAllFontFacesFinishLoading?: () => void;
    }

    class EditableText extends React.Component<EditableTextProps> {
        nativePtr: UE.EditableText;
    }

    interface EditableTextBoxProps extends WidgetProps {
        Text?: string;
        TextDelegate?: () => string;
        WidgetStyle?: RecursivePartial<UE.EditableTextBoxStyle>;
        HintText?: string;
        HintTextDelegate?: () => string;
        IsReadOnly?: boolean;
        IsPassword?: boolean;
        MinimumDesiredWidth?: number;
        IsCaretMovedWhenGainFocus?: boolean;
        SelectAllTextWhenFocused?: boolean;
        RevertTextOnEscape?: boolean;
        ClearKeyboardFocusOnCommit?: boolean;
        SelectAllTextOnCommit?: boolean;
        AllowContextMenu?: boolean;
        KeyboardType?: UE.EVirtualKeyboardType;
        VirtualKeyboardOptions?: RecursivePartial<UE.VirtualKeyboardOptions>;
        VirtualKeyboardTrigger?: UE.EVirtualKeyboardTrigger;
        VirtualKeyboardDismissAction?: UE.EVirtualKeyboardDismissAction;
        Justification?: UE.ETextJustify;
        OverflowPolicy?: UE.ETextOverflowPolicy;
        ShapedTextOptions?: RecursivePartial<UE.ShapedTextOptions>;
        OnTextChanged?: (Text: string) => void;
        OnTextCommitted?: (Text: string, CommitMethod: UE.ETextCommit) => void;
        bIsFontDeprecationDone?: boolean;
        FontFacesLoadingPaintPolicy?: UE.EFontFacesLoadingPaintPolicy;
        OnAllFontFacesFinishLoading?: () => void;
    }

    class EditableTextBox extends React.Component<EditableTextBoxProps> {
        nativePtr: UE.EditableTextBox;
    }

    interface ExpandableAreaProps extends WidgetProps {
        Style?: RecursivePartial<UE.ExpandableAreaStyle>;
        BorderBrush?: RecursivePartial<UE.SlateBrush>;
        BorderColor?: RecursivePartial<UE.SlateColor>;
        bIsExpanded?: boolean;
        MaxHeight?: number;
        HeaderPadding?: RecursivePartial<UE.Margin>;
        AreaPadding?: RecursivePartial<UE.Margin>;
    }

    class ExpandableArea extends React.Component<ExpandableAreaProps> {
        nativePtr: UE.ExpandableArea;
    }

    interface GridPanelProps extends PanelWidgetProps {
        ColumnFill?: TArray<number>;
        RowFill?: TArray<number>;
    }

    class GridPanel extends React.Component<GridPanelProps> {
        nativePtr: UE.GridPanel;
    }

    interface HorizontalBoxProps extends PanelWidgetProps {
    }

    class HorizontalBox extends React.Component<HorizontalBoxProps> {
        nativePtr: UE.HorizontalBox;
    }

    interface ImageProps extends WidgetProps {
        Brush?: RecursivePartial<UE.SlateBrush>;
        BrushDelegate?: () => UE.SlateBrush;
        ColorAndOpacity?: RecursivePartial<UE.LinearColor>;
        ColorAndOpacityDelegate?: () => UE.LinearColor;
        bFlipForRightToLeftFlowDirection?: boolean;
        OnMouseButtonDownEvent?: (MyGeometry: UE.Geometry, MouseEvent: UE.PointerEvent) => UE.EventReply;
    }

    class Image extends React.Component<ImageProps> {
        nativePtr: UE.Image;
    }

    interface InputKeySelectorProps extends WidgetProps {
        WidgetStyle?: RecursivePartial<UE.ButtonStyle>;
        TextStyle?: RecursivePartial<UE.TextBlockStyle>;
        SelectedKey?: RecursivePartial<UE.InputChord>;
        Margin?: RecursivePartial<UE.Margin>;
        KeySelectionText?: string;
        NoKeySpecifiedText?: string;
        bAllowModifierKeys?: boolean;
        bAllowGamepadKeys?: boolean;
        EscapeKeys?: TArray<UE.Key>;
        OnKeySelected?: (SelectedKey: UE.InputChord) => void;
        OnIsSelectingKeyChanged?: () => void;
    }

    class InputKeySelector extends React.Component<InputKeySelectorProps> {
        nativePtr: UE.InputKeySelector;
    }

    interface InvalidationBoxProps extends ContentWidgetProps {
        bCanCache?: boolean;
    }

    class InvalidationBox extends React.Component<InvalidationBoxProps> {
        nativePtr: UE.InvalidationBox;
    }

    interface MenuAnchorProps extends ContentWidgetProps {
        Placement?: UE.EMenuPlacement;
        bFitInWindow?: boolean;
        ShouldDeferPaintingAfterWindowContent?: boolean;
        UseApplicationMenuStack?: boolean;
        ShowMenuBackground?: boolean;
        OnMenuOpenChanged?: (bIsOpen: boolean) => void;
    }

    class MenuAnchor extends React.Component<MenuAnchorProps> {
        nativePtr: UE.MenuAnchor;
    }

    interface TextLayoutWidgetProps extends WidgetProps {
        ShapedTextOptions?: RecursivePartial<UE.ShapedTextOptions>;
        OnAllFontFacesFinishLoading?: () => void;
        Justification?: UE.ETextJustify;
        WrappingPolicy?: UE.ETextWrappingPolicy;
        AutoWrapText?: boolean;
        ApplyLineHeightToBottomLine?: boolean;
        FontFacesLoadingPaintPolicy?: UE.EFontFacesLoadingPaintPolicy;
        WrapTextAt?: number;
        Margin?: RecursivePartial<UE.Margin>;
        LineHeightPercentage?: number;
    }

    class TextLayoutWidget extends React.Component<TextLayoutWidgetProps> {
        nativePtr: UE.TextLayoutWidget;
    }

    interface MultiLineEditableTextProps extends TextLayoutWidgetProps {
        Text?: string;
        HintText?: string;
        HintTextDelegate?: () => string;
        WidgetStyle?: RecursivePartial<UE.TextBlockStyle>;
        bIsReadOnly?: boolean;
        SelectAllTextWhenFocused?: boolean;
        ClearTextSelectionOnFocusLoss?: boolean;
        RevertTextOnEscape?: boolean;
        ClearKeyboardFocusOnCommit?: boolean;
        AllowContextMenu?: boolean;
        VirtualKeyboardOptions?: RecursivePartial<UE.VirtualKeyboardOptions>;
        VirtualKeyboardDismissAction?: UE.EVirtualKeyboardDismissAction;
        OnTextChanged?: (Text: string) => void;
        OnTextCommitted?: (Text: string, CommitMethod: UE.ETextCommit) => void;
    }

    class MultiLineEditableText extends React.Component<MultiLineEditableTextProps> {
        nativePtr: UE.MultiLineEditableText;
    }

    interface MultiLineEditableTextBoxProps extends TextLayoutWidgetProps {
        Text?: string;
        HintText?: string;
        HintTextDelegate?: () => string;
        WidgetStyle?: RecursivePartial<UE.EditableTextBoxStyle>;
        TextStyle?: RecursivePartial<UE.TextBlockStyle>;
        bIsReadOnly?: boolean;
        AllowContextMenu?: boolean;
        VirtualKeyboardOptions?: RecursivePartial<UE.VirtualKeyboardOptions>;
        VirtualKeyboardDismissAction?: UE.EVirtualKeyboardDismissAction;
        OnTextChanged?: (Text: string) => void;
        OnTextCommitted?: (Text: string, CommitMethod: UE.ETextCommit) => void;
        bIsFontDeprecationDone?: boolean;
    }

    class MultiLineEditableTextBox extends React.Component<MultiLineEditableTextBoxProps> {
        nativePtr: UE.MultiLineEditableTextBox;
    }

    interface NamedSlotProps extends ContentWidgetProps {
        bExposeOnInstanceOnly?: boolean;
        SlotGuid?: RecursivePartial<UE.Guid>;
    }

    class NamedSlot extends React.Component<NamedSlotProps> {
        nativePtr: UE.NamedSlot;
    }

    interface NativeWidgetHostProps extends WidgetProps {
    }

    class NativeWidgetHost extends React.Component<NativeWidgetHostProps> {
        nativePtr: UE.NativeWidgetHost;
    }

    interface OverlayProps extends PanelWidgetProps {
    }

    class Overlay extends React.Component<OverlayProps> {
        nativePtr: UE.Overlay;
    }

    interface PostBufferUpdateProps extends WidgetProps {
        bUpdateOnlyPaintArea?: boolean;
        bPerformDefaultPostBufferUpdate?: boolean;
        BuffersToUpdate?: TArray<UE.ESlatePostRT>;
        UpdateBufferInfos?: TArray<UE.SlatePostBufferUpdateInfo>;
    }

    class PostBufferUpdate extends React.Component<PostBufferUpdateProps> {
        nativePtr: UE.PostBufferUpdate;
    }

    interface ProgressBarProps extends WidgetProps {
        WidgetStyle?: RecursivePartial<UE.ProgressBarStyle>;
        Percent?: number;
        BarFillType?: UE.EProgressBarFillType;
        BarFillStyle?: UE.EProgressBarFillStyle;
        bIsMarquee?: boolean;
        BorderPadding?: RecursivePartial<UE.Vector2D>;
        PercentDelegate?: () => number;
        FillColorAndOpacity?: RecursivePartial<UE.LinearColor>;
        FillColorAndOpacityDelegate?: () => UE.LinearColor;
    }

    class ProgressBar extends React.Component<ProgressBarProps> {
        nativePtr: UE.ProgressBar;
    }

    interface RetainerBoxProps extends ContentWidgetProps {
        bRetainRender?: boolean;
        RenderOnInvalidation?: boolean;
        RenderOnPhase?: boolean;
        Phase?: number;
        PhaseCount?: number;
        TextureParameter?: string;
        bShowEffectsInDesigner?: boolean;
    }

    class RetainerBox extends React.Component<RetainerBoxProps> {
        nativePtr: UE.RetainerBox;
    }

    interface RichTextBlockProps extends TextLayoutWidgetProps {
        Text?: string;
        DefaultTextStyleOverride?: RecursivePartial<UE.TextBlockStyle>;
        MinDesiredWidth?: number;
        bOverrideDefaultStyle?: boolean;
        TextTransformPolicy?: UE.ETextTransformPolicy;
        TextOverflowPolicy?: UE.ETextOverflowPolicy;
        DefaultTextStyle?: RecursivePartial<UE.TextBlockStyle>;
    }

    class RichTextBlock extends React.Component<RichTextBlockProps> {
        nativePtr: UE.RichTextBlock;
    }

    interface SafeZoneProps extends ContentWidgetProps {
        PadLeft?: boolean;
        PadRight?: boolean;
        PadTop?: boolean;
        PadBottom?: boolean;
    }

    class SafeZone extends React.Component<SafeZoneProps> {
        nativePtr: UE.SafeZone;
    }

    interface ScaleBoxProps extends ContentWidgetProps {
        Stretch?: UE.EStretch;
        StretchDirection?: UE.EStretchDirection;
        UserSpecifiedScale?: number;
        IgnoreInheritedScale?: boolean;
    }

    class ScaleBox extends React.Component<ScaleBoxProps> {
        nativePtr: UE.ScaleBox;
    }

    interface ScrollBarProps extends WidgetProps {
        WidgetStyle?: RecursivePartial<UE.ScrollBarStyle>;
        bAlwaysShowScrollbar?: boolean;
        bAlwaysShowScrollbarTrack?: boolean;
        Orientation?: UE.EOrientation;
        Thickness?: RecursivePartial<UE.Vector2D>;
        Padding?: RecursivePartial<UE.Margin>;
    }

    class ScrollBar extends React.Component<ScrollBarProps> {
        nativePtr: UE.ScrollBar;
    }

    interface ScrollBoxProps extends PanelWidgetProps {
        ScrollAnimationInterpolationSpeed?: number;
        bEnableTouchScrolling?: boolean;
        bConsumePointerInput?: boolean;
        AnalogMouseWheelKey?: RecursivePartial<UE.Key>;
        bIsFocusable?: boolean;
        WidgetStyle?: RecursivePartial<UE.ScrollBoxStyle>;
        WidgetBarStyle?: RecursivePartial<UE.ScrollBarStyle>;
        Orientation?: UE.EOrientation;
        ScrollBarVisibility?: UE.ESlateVisibility;
        ConsumeMouseWheel?: UE.EConsumeMouseWheel;
        ScrollbarThickness?: RecursivePartial<UE.Vector2D>;
        ScrollbarPadding?: RecursivePartial<UE.Margin>;
        AlwaysShowScrollbar?: boolean;
        AlwaysShowScrollbarTrack?: boolean;
        AllowOverscroll?: boolean;
        BackPadScrolling?: boolean;
        FrontPadScrolling?: boolean;
        bAnimateWheelScrolling?: boolean;
        NavigationDestination?: UE.EDescendantScrollDestination;
        NavigationScrollPadding?: number;
        ScrollWhenFocusChanges?: UE.EScrollWhenFocusChanges;
        bAllowRightClickDragScrolling?: boolean;
        WheelScrollMultiplier?: number;
        OnUserScrolled?: (CurrentOffset: number) => void;
        OnScrollBarVisibilityChanged?: (NewVisibility: UE.ESlateVisibility) => void;
        OnFocusReceived?: () => void;
        OnFocusLost?: () => void;
    }

    class ScrollBox extends React.Component<ScrollBoxProps> {
        nativePtr: UE.ScrollBox;
    }

    interface SizeBoxProps extends ContentWidgetProps {
        WidthOverride?: number;
        HeightOverride?: number;
        MinDesiredWidth?: number;
        MinDesiredHeight?: number;
        MaxDesiredWidth?: number;
        MaxDesiredHeight?: number;
        MinAspectRatio?: number;
        MaxAspectRatio?: number;
        bOverride_WidthOverride?: boolean;
        bOverride_HeightOverride?: boolean;
        bOverride_MinDesiredWidth?: boolean;
        bOverride_MinDesiredHeight?: boolean;
        bOverride_MaxDesiredWidth?: boolean;
        bOverride_MaxDesiredHeight?: boolean;
        bOverride_MinAspectRatio?: boolean;
        bOverride_MaxAspectRatio?: boolean;
    }

    class SizeBox extends React.Component<SizeBoxProps> {
        nativePtr: UE.SizeBox;
    }

    interface SliderProps extends WidgetProps {
        Value?: number;
        ValueDelegate?: () => number;
        MinValue?: number;
        MaxValue?: number;
        WidgetStyle?: RecursivePartial<UE.SliderStyle>;
        Orientation?: UE.EOrientation;
        SliderBarColor?: RecursivePartial<UE.LinearColor>;
        SliderHandleColor?: RecursivePartial<UE.LinearColor>;
        IndentHandle?: boolean;
        Locked?: boolean;
        MouseUsesStep?: boolean;
        RequiresControllerLock?: boolean;
        StepSize?: number;
        IsFocusable?: boolean;
        bPreventThrottling?: boolean;
        OnMouseCaptureBegin?: () => void;
        OnMouseCaptureEnd?: () => void;
        OnControllerCaptureBegin?: () => void;
        OnControllerCaptureEnd?: () => void;
        OnValueChanged?: (Value: number) => void;
    }

    class Slider extends React.Component<SliderProps> {
        nativePtr: UE.Slider;
    }

    interface SpacerProps extends WidgetProps {
        Size?: RecursivePartial<UE.Vector2D>;
    }

    class Spacer extends React.Component<SpacerProps> {
        nativePtr: UE.Spacer;
    }

    interface SpinBoxProps extends WidgetProps {
        Value?: number;
        ValueDelegate?: () => number;
        WidgetStyle?: RecursivePartial<UE.SpinBoxStyle>;
        MinFractionalDigits?: number;
        MaxFractionalDigits?: number;
        bAlwaysUsesDeltaSnap?: boolean;
        bEnableSlider?: boolean;
        Delta?: number;
        SliderExponent?: number;
        Font?: RecursivePartial<UE.SlateFontInfo>;
        Justification?: UE.ETextJustify;
        MinDesiredWidth?: number;
        KeyboardType?: UE.EVirtualKeyboardType;
        VirtualKeyboardDismissAction?: UE.EVirtualKeyboardDismissAction;
        ClearKeyboardFocusOnCommit?: boolean;
        SelectAllTextOnCommit?: boolean;
        ForegroundColor?: RecursivePartial<UE.SlateColor>;
        OnValueChanged?: (InValue: number) => void;
        OnValueCommitted?: (InValue: number, CommitMethod: UE.ETextCommit) => void;
        OnBeginSliderMovement?: () => void;
        OnEndSliderMovement?: (InValue: number) => void;
        bOverride_MinValue?: boolean;
        bOverride_MaxValue?: boolean;
        bOverride_MinSliderValue?: boolean;
        bOverride_MaxSliderValue?: boolean;
        MinValue?: number;
        MaxValue?: number;
        MinSliderValue?: number;
        MaxSliderValue?: number;
    }

    class SpinBox extends React.Component<SpinBoxProps> {
        nativePtr: UE.SpinBox;
    }

    interface StackBoxProps extends PanelWidgetProps {
        Orientation?: UE.EOrientation;
    }

    class StackBox extends React.Component<StackBoxProps> {
        nativePtr: UE.StackBox;
    }

    interface TextBlockProps extends TextLayoutWidgetProps {
        Text?: string;
        TextDelegate?: () => string;
        ColorAndOpacity?: RecursivePartial<UE.SlateColor>;
        ColorAndOpacityDelegate?: () => UE.SlateColor;
        MinDesiredWidth?: number;
        Font?: RecursivePartial<UE.SlateFontInfo>;
        StrikeBrush?: RecursivePartial<UE.SlateBrush>;
        ShadowOffset?: RecursivePartial<UE.Vector2D>;
        ShadowColorAndOpacity?: RecursivePartial<UE.LinearColor>;
        ShadowColorAndOpacityDelegate?: () => UE.LinearColor;
        bWrapWithInvalidationPanel?: boolean;
        TextTransformPolicy?: UE.ETextTransformPolicy;
        TextOverflowPolicy?: UE.ETextOverflowPolicy;
        bSimpleTextMode?: boolean;
    }

    class TextBlock extends React.Component<TextBlockProps> {
        nativePtr: UE.TextBlock;
    }

    interface ThrobberProps extends WidgetProps {
        NumberOfPieces?: number;
        bAnimateHorizontally?: boolean;
        bAnimateVertically?: boolean;
        bAnimateOpacity?: boolean;
        Image?: RecursivePartial<UE.SlateBrush>;
    }

    class Throbber extends React.Component<ThrobberProps> {
        nativePtr: UE.Throbber;
    }

    interface TileViewProps extends ListViewProps {
        EntryHeight?: number;
        EntryWidth?: number;
        TileAlignment?: UE.EListItemAlignment;
        bWrapHorizontalNavigation?: boolean;
        ScrollbarDisabledVisibility?: UE.ESlateVisibility;
        bEntrySizeIncludesEntrySpacing?: boolean;
    }

    class TileView extends React.Component<TileViewProps> {
        nativePtr: UE.TileView;
    }

    interface TreeViewProps extends ListViewProps {
    }

    class TreeView extends React.Component<TreeViewProps> {
        nativePtr: UE.TreeView;
    }

    interface UniformGridPanelProps extends PanelWidgetProps {
        SlotPadding?: RecursivePartial<UE.Margin>;
        MinDesiredSlotWidth?: number;
        MinDesiredSlotHeight?: number;
    }

    class UniformGridPanel extends React.Component<UniformGridPanelProps> {
        nativePtr: UE.UniformGridPanel;
    }

    interface VerticalBoxProps extends PanelWidgetProps {
    }

    class VerticalBox extends React.Component<VerticalBoxProps> {
        nativePtr: UE.VerticalBox;
    }

    interface ViewportProps extends ContentWidgetProps {
        BackgroundColor?: RecursivePartial<UE.LinearColor>;
        bIsEditorPreview?: boolean;
    }

    class Viewport extends React.Component<ViewportProps> {
        nativePtr: UE.Viewport;
    }

    interface WidgetSwitcherProps extends PanelWidgetProps {
        ActiveWidgetIndex?: number;
    }

    class WidgetSwitcher extends React.Component<WidgetSwitcherProps> {
        nativePtr: UE.WidgetSwitcher;
    }

    interface WindowTitleBarAreaProps extends ContentWidgetProps {
        bWindowButtonsEnabled?: boolean;
        bDoubleClickTogglesFullscreen?: boolean;
    }

    class WindowTitleBarArea extends React.Component<WindowTitleBarAreaProps> {
        nativePtr: UE.WindowTitleBarArea;
    }

    interface WrapBoxProps extends PanelWidgetProps {
        InnerSlotPadding?: RecursivePartial<UE.Vector2D>;
        WrapSize?: number;
        bExplicitWrapSize?: boolean;
        HorizontalAlignment?: UE.EHorizontalAlignment;
        Orientation?: UE.EOrientation;
    }

    class WrapBox extends React.Component<WrapBoxProps> {
        nativePtr: UE.WrapBox;
    }

    interface EditorUtilityWidgetProps extends UserWidgetProps {
        TabDisplayName?: string;
        HelpText?: string;
        bAlwaysReregisterWithWindowsMenu?: boolean;
        bAutoRunDefaultAction?: boolean;
        bRunEditorUtilityOnStartup?: boolean;
    }

    class EditorUtilityWidget extends React.Component<EditorUtilityWidgetProps> {
        nativePtr: UE.EditorUtilityWidget;
    }

    interface EditorUtilityDialogWidgetProps extends EditorUtilityWidgetProps {
        DialogTitle?: string;
        DesiredDialogSize?: RecursivePartial<UE.Vector2D>;
        ButtonLayout?: UE.EAppMsgType;
    }

    class EditorUtilityDialogWidget extends React.Component<EditorUtilityDialogWidgetProps> {
        nativePtr: UE.EditorUtilityDialogWidget;
    }

    interface EditorUtilityButtonProps extends ButtonProps {
    }

    class EditorUtilityButton extends React.Component<EditorUtilityButtonProps> {
        nativePtr: UE.EditorUtilityButton;
    }

    interface EditorUtilityCheckBoxProps extends CheckBoxProps {
    }

    class EditorUtilityCheckBox extends React.Component<EditorUtilityCheckBoxProps> {
        nativePtr: UE.EditorUtilityCheckBox;
    }

    interface EditorUtilityCircularThrobberProps extends CircularThrobberProps {
    }

    class EditorUtilityCircularThrobber extends React.Component<EditorUtilityCircularThrobberProps> {
        nativePtr: UE.EditorUtilityCircularThrobber;
    }

    interface EditorUtilityComboBoxKeyProps extends ComboBoxKeyProps {
    }

    class EditorUtilityComboBoxKey extends React.Component<EditorUtilityComboBoxKeyProps> {
        nativePtr: UE.EditorUtilityComboBoxKey;
    }

    interface EditorUtilityComboBoxStringProps extends ComboBoxStringProps {
    }

    class EditorUtilityComboBoxString extends React.Component<EditorUtilityComboBoxStringProps> {
        nativePtr: UE.EditorUtilityComboBoxString;
    }

    interface EditorUtilityEditableTextProps extends EditableTextProps {
    }

    class EditorUtilityEditableText extends React.Component<EditorUtilityEditableTextProps> {
        nativePtr: UE.EditorUtilityEditableText;
    }

    interface EditorUtilityEditableTextBoxProps extends EditableTextBoxProps {
    }

    class EditorUtilityEditableTextBox extends React.Component<EditorUtilityEditableTextBoxProps> {
        nativePtr: UE.EditorUtilityEditableTextBox;
    }

    interface EditorUtilityExpandableAreaProps extends ExpandableAreaProps {
    }

    class EditorUtilityExpandableArea extends React.Component<EditorUtilityExpandableAreaProps> {
        nativePtr: UE.EditorUtilityExpandableArea;
    }

    interface EditorUtilityInputKeySelectorProps extends InputKeySelectorProps {
    }

    class EditorUtilityInputKeySelector extends React.Component<EditorUtilityInputKeySelectorProps> {
        nativePtr: UE.EditorUtilityInputKeySelector;
    }

    interface EditorUtilityListViewProps extends ListViewProps {
    }

    class EditorUtilityListView extends React.Component<EditorUtilityListViewProps> {
        nativePtr: UE.EditorUtilityListView;
    }

    interface EditorUtilityMultiLineEditableTextProps extends MultiLineEditableTextProps {
    }

    class EditorUtilityMultiLineEditableText extends React.Component<EditorUtilityMultiLineEditableTextProps> {
        nativePtr: UE.EditorUtilityMultiLineEditableText;
    }

    interface EditorUtilityMultiLineEditableTextBoxProps extends MultiLineEditableTextBoxProps {
    }

    class EditorUtilityMultiLineEditableTextBox extends React.Component<EditorUtilityMultiLineEditableTextBoxProps> {
        nativePtr: UE.EditorUtilityMultiLineEditableTextBox;
    }

    interface EditorUtilityProgressBarProps extends ProgressBarProps {
    }

    class EditorUtilityProgressBar extends React.Component<EditorUtilityProgressBarProps> {
        nativePtr: UE.EditorUtilityProgressBar;
    }

    interface EditorUtilityScrollBarProps extends ScrollBarProps {
    }

    class EditorUtilityScrollBar extends React.Component<EditorUtilityScrollBarProps> {
        nativePtr: UE.EditorUtilityScrollBar;
    }

    interface EditorUtilityScrollBoxProps extends ScrollBoxProps {
    }

    class EditorUtilityScrollBox extends React.Component<EditorUtilityScrollBoxProps> {
        nativePtr: UE.EditorUtilityScrollBox;
    }

    interface EditorUtilitySliderProps extends SliderProps {
    }

    class EditorUtilitySlider extends React.Component<EditorUtilitySliderProps> {
        nativePtr: UE.EditorUtilitySlider;
    }

    interface EditorUtilitySpinBoxProps extends SpinBoxProps {
    }

    class EditorUtilitySpinBox extends React.Component<EditorUtilitySpinBoxProps> {
        nativePtr: UE.EditorUtilitySpinBox;
    }

    interface EditorUtilityThrobberProps extends ThrobberProps {
    }

    class EditorUtilityThrobber extends React.Component<EditorUtilityThrobberProps> {
        nativePtr: UE.EditorUtilityThrobber;
    }

    interface EditorUtilityTreeViewProps extends TreeViewProps {
    }

    class EditorUtilityTreeView extends React.Component<EditorUtilityTreeViewProps> {
        nativePtr: UE.EditorUtilityTreeView;
    }

    interface ToolMenuWidgetProps extends WidgetProps {
        MenuName?: string;
        MenuType?: UE.EMultiBoxType;
        FullMenuName?: string;
    }

    class ToolMenuWidget extends React.Component<ToolMenuWidgetProps> {
        nativePtr: UE.ToolMenuWidget;
    }

    interface AssetThumbnailWidgetProps extends WidgetProps {
        AssetToShow?: RecursivePartial<UE.AssetData>;
        Resolution?: RecursivePartial<UE.IntPoint>;
        ThumbnailSettings?: RecursivePartial<UE.AssetThumbnailWidgetSettings>;
    }

    class AssetThumbnailWidget extends React.Component<AssetThumbnailWidgetProps> {
        nativePtr: UE.AssetThumbnailWidget;
    }

    interface LevelSequenceBurnInProps extends UserWidgetProps {
        FrameInformation?: RecursivePartial<UE.LevelSequencePlayerSnapshot>;
    }

    class LevelSequenceBurnIn extends React.Component<LevelSequenceBurnInProps> {
        nativePtr: UE.LevelSequenceBurnIn;
    }

    interface PropertyViewBaseProps extends WidgetProps {
        SoftObjectPath?: RecursivePartial<UE.SoftObjectPath>;
        bAutoLoadAsset?: boolean;
        OnPropertyChanged?: (PropertyName: string) => void;
    }

    class PropertyViewBase extends React.Component<PropertyViewBaseProps> {
        nativePtr: UE.PropertyViewBase;
    }

    interface DetailsViewProps extends PropertyViewBaseProps {
        bAllowFiltering?: boolean;
        bAllowFavoriteSystem?: boolean;
        bShowModifiedPropertiesOption?: boolean;
        bShowKeyablePropertiesOption?: boolean;
        bShowAnimatedPropertiesOption?: boolean;
        ColumnWidth?: number;
        bShowScrollBar?: boolean;
        bForceHiddenPropertyVisibility?: boolean;
        ViewIdentifier?: string;
        CategoriesToShow?: TArray<string>;
        PropertiesToShow?: TArray<string>;
        bShowOnlyAllowed?: boolean;
    }

    class DetailsView extends React.Component<DetailsViewProps> {
        nativePtr: UE.DetailsView;
    }

    interface SinglePropertyViewProps extends PropertyViewBaseProps {
        PropertyName?: string;
        NameOverride?: string;
    }

    class SinglePropertyView extends React.Component<SinglePropertyViewProps> {
        nativePtr: UE.SinglePropertyView;
    }

    interface DGGUIProps extends UserWidgetProps {
    }

    class DGGUI extends React.Component<DGGUIProps> {
        nativePtr: UE.DGGUI;
    }

    interface TakeRecorderOverlayWidgetProps extends UserWidgetProps {
    }

    class TakeRecorderOverlayWidget extends React.Component<TakeRecorderOverlayWidgetProps> {
        nativePtr: UE.TakeRecorderOverlayWidget;
    }

    interface AudioMaterialButtonProps extends WidgetProps {
        WidgetStyle?: RecursivePartial<UE.AudioMaterialButtonStyle>;
        OnButtonPressedChangedEvent?: (bIsPressed: boolean) => void;
        OnMouseCaptureBegin?: () => void;
        OnMouseCaptureEnd?: () => void;
        bIsPressed?: boolean;
    }

    class AudioMaterialButton extends React.Component<AudioMaterialButtonProps> {
        nativePtr: UE.AudioMaterialButton;
    }

    interface AudioMaterialEnvelopeProps extends WidgetProps {
        WidgetStyle?: RecursivePartial<UE.AudioMaterialEnvelopeStyle>;
        EnvelopeSettings?: RecursivePartial<UE.AudioMaterialEnvelopeSettings>;
    }

    class AudioMaterialEnvelope extends React.Component<AudioMaterialEnvelopeProps> {
        nativePtr: UE.AudioMaterialEnvelope;
    }

    interface AudioMaterialKnobProps extends WidgetProps {
        WidgetStyle?: RecursivePartial<UE.AudioMaterialKnobStyle>;
        OnKnobValueChanged?: (Value: number) => void;
        OnMouseCaptureBegin?: () => void;
        OnMouseCaptureEnd?: () => void;
        Value?: number;
        TuneSpeed?: number;
        FineTuneSpeed?: number;
        bLocked?: boolean;
        bMouseUsesStep?: boolean;
        StepSize?: number;
    }

    class AudioMaterialKnob extends React.Component<AudioMaterialKnobProps> {
        nativePtr: UE.AudioMaterialKnob;
    }

    interface AudioMaterialMeterProps extends WidgetProps {
        WidgetStyle?: RecursivePartial<UE.AudioMaterialMeterStyle>;
        Orientation?: UE.EOrientation;
        MeterChannelInfoDelegate?: () => TArray<UE.MeterChannelInfo>;
        MeterChannelInfo?: TArray<UE.MeterChannelInfo>;
    }

    class AudioMaterialMeter extends React.Component<AudioMaterialMeterProps> {
        nativePtr: UE.AudioMaterialMeter;
    }

    interface AudioMaterialSliderProps extends WidgetProps {
        WidgetStyle?: RecursivePartial<UE.AudioMaterialSliderStyle>;
        OnValueChanged?: (Value: number) => void;
        OnMouseCaptureBegin?: () => void;
        OnMouseCaptureEnd?: () => void;
        Value?: number;
        Orientation?: UE.EOrientation;
        TuneSpeed?: number;
        FineTuneSpeed?: number;
        bLocked?: boolean;
        bMouseUsesStep?: boolean;
        StepSize?: number;
    }

    class AudioMaterialSlider extends React.Component<AudioMaterialSliderProps> {
        nativePtr: UE.AudioMaterialSlider;
    }

    interface AudioMeterProps extends WidgetProps {
        MeterChannelInfo?: TArray<UE.MeterChannelInfo>;
        MeterChannelInfoDelegate?: () => TArray<UE.MeterChannelInfo>;
        WidgetStyle?: RecursivePartial<UE.AudioMeterStyle>;
        Orientation?: UE.EOrientation;
        BackgroundColor?: RecursivePartial<UE.LinearColor>;
        MeterBackgroundColor?: RecursivePartial<UE.LinearColor>;
        MeterValueColor?: RecursivePartial<UE.LinearColor>;
        MeterPeakColor?: RecursivePartial<UE.LinearColor>;
        MeterClippingColor?: RecursivePartial<UE.LinearColor>;
        MeterScaleColor?: RecursivePartial<UE.LinearColor>;
        MeterScaleLabelColor?: RecursivePartial<UE.LinearColor>;
    }

    class AudioMeter extends React.Component<AudioMeterProps> {
        nativePtr: UE.AudioMeter;
    }

    interface AudioOscilloscopeProps extends WidgetProps {
        OscilloscopeStyle?: RecursivePartial<UE.AudioOscilloscopePanelStyle>;
        MaxTimeWindowMs?: number;
        TimeWindowMs?: number;
        AnalysisPeriodMs?: number;
        bShowTimeGrid?: boolean;
        TimeGridLabelsUnit?: UE.EXAxisLabelsUnit;
        bShowAmplitudeGrid?: boolean;
        bShowAmplitudeLabels?: boolean;
        AmplitudeGridLabelsUnit?: UE.EYAxisLabelsUnit;
        TriggerMode?: UE.EAudioOscilloscopeTriggerMode;
        TriggerThreshold?: number;
        PanelLayoutType?: UE.EAudioPanelLayoutType;
        ChannelToAnalyze?: number;
    }

    class AudioOscilloscope extends React.Component<AudioOscilloscopeProps> {
        nativePtr: UE.AudioOscilloscope;
    }

    interface AudioRadialSliderProps extends WidgetProps {
        Value?: number;
        ValueDelegate?: () => number;
        WidgetLayout?: UE.EAudioRadialSliderLayout;
        CenterBackgroundColor?: RecursivePartial<UE.LinearColor>;
        SliderProgressColor?: RecursivePartial<UE.LinearColor>;
        SliderBarColor?: RecursivePartial<UE.LinearColor>;
        HandStartEndRatio?: RecursivePartial<UE.Vector2D>;
        UnitsText?: string;
        TextLabelBackgroundColor?: RecursivePartial<UE.LinearColor>;
        ShowLabelOnlyOnHover?: boolean;
        ShowUnitsText?: boolean;
        IsUnitsTextReadOnly?: boolean;
        IsValueTextReadOnly?: boolean;
        SliderThickness?: number;
        OutputRange?: RecursivePartial<UE.Vector2D>;
        OnValueChanged?: (Value: number) => void;
        OnMouseCaptureBegin?: () => void;
        OnMouseCaptureEnd?: () => void;
    }

    class AudioRadialSlider extends React.Component<AudioRadialSliderProps> {
        nativePtr: UE.AudioRadialSlider;
    }

    interface AudioVolumeRadialSliderProps extends AudioRadialSliderProps {
    }

    class AudioVolumeRadialSlider extends React.Component<AudioVolumeRadialSliderProps> {
        nativePtr: UE.AudioVolumeRadialSlider;
    }

    interface AudioFrequencyRadialSliderProps extends AudioRadialSliderProps {
    }

    class AudioFrequencyRadialSlider extends React.Component<AudioFrequencyRadialSliderProps> {
        nativePtr: UE.AudioFrequencyRadialSlider;
    }

    interface AudioSliderBaseProps extends WidgetProps {
        Value?: number;
        UnitsText?: string;
        TextLabelBackgroundColor?: RecursivePartial<UE.LinearColor>;
        TextLabelBackgroundColorDelegate?: () => UE.LinearColor;
        ShowLabelOnlyOnHover?: boolean;
        ShowUnitsText?: boolean;
        IsUnitsTextReadOnly?: boolean;
        IsValueTextReadOnly?: boolean;
        ValueDelegate?: () => number;
        SliderBackgroundColor?: RecursivePartial<UE.LinearColor>;
        SliderBackgroundColorDelegate?: () => UE.LinearColor;
        SliderBarColor?: RecursivePartial<UE.LinearColor>;
        SliderBarColorDelegate?: () => UE.LinearColor;
        SliderThumbColor?: RecursivePartial<UE.LinearColor>;
        SliderThumbColorDelegate?: () => UE.LinearColor;
        WidgetBackgroundColor?: RecursivePartial<UE.LinearColor>;
        WidgetBackgroundColorDelegate?: () => UE.LinearColor;
        Orientation?: UE.EOrientation;
        OnValueChanged?: (Value: number) => void;
        OnMouseCaptureBegin?: () => void;
        OnMouseCaptureEnd?: () => void;
    }

    class AudioSliderBase extends React.Component<AudioSliderBaseProps> {
        nativePtr: UE.AudioSliderBase;
    }

    interface AudioSliderProps extends AudioSliderBaseProps {
    }

    class AudioSlider extends React.Component<AudioSliderProps> {
        nativePtr: UE.AudioSlider;
    }

    interface AudioVolumeSliderProps extends AudioSliderProps {
    }

    class AudioVolumeSlider extends React.Component<AudioVolumeSliderProps> {
        nativePtr: UE.AudioVolumeSlider;
    }

    interface AudioFrequencySliderProps extends AudioSliderBaseProps {
        OutputRange?: RecursivePartial<UE.Vector2D>;
    }

    class AudioFrequencySlider extends React.Component<AudioFrequencySliderProps> {
        nativePtr: UE.AudioFrequencySlider;
    }

    interface AudioVectorscopeProps extends WidgetProps {
        VectorscopeStyle?: RecursivePartial<UE.AudioVectorscopePanelStyle>;
        bShowGrid?: boolean;
        GridDivisions?: number;
        MaxDisplayPersistenceMs?: number;
        DisplayPersistenceMs?: number;
        Scale?: number;
        PanelLayoutType?: UE.EAudioPanelLayoutType;
    }

    class AudioVectorscope extends React.Component<AudioVectorscopeProps> {
        nativePtr: UE.AudioVectorscope;
    }

    interface Synth2DSliderProps extends WidgetProps {
        ValueX?: number;
        ValueY?: number;
        ValueXDelegate?: () => number;
        ValueYDelegate?: () => number;
        WidgetStyle?: RecursivePartial<UE.Synth2DSliderStyle>;
        SliderHandleColor?: RecursivePartial<UE.LinearColor>;
        IndentHandle?: boolean;
        Locked?: boolean;
        StepSize?: number;
        IsFocusable?: boolean;
        OnMouseCaptureBegin?: () => void;
        OnMouseCaptureEnd?: () => void;
        OnControllerCaptureBegin?: () => void;
        OnControllerCaptureEnd?: () => void;
        OnValueChangedX?: (Value: number) => void;
        OnValueChangedY?: (Value: number) => void;
    }

    class Synth2DSlider extends React.Component<Synth2DSliderProps> {
        nativePtr: UE.Synth2DSlider;
    }

    interface SynthKnobProps extends WidgetProps {
        Value?: number;
        StepSize?: number;
        MouseSpeed?: number;
        MouseFineTuneSpeed?: number;
        ShowTooltipInfo?: boolean;
        ParameterName?: string;
        ParameterUnits?: string;
        ValueDelegate?: () => number;
        WidgetStyle?: RecursivePartial<UE.SynthKnobStyle>;
        Locked?: boolean;
        IsFocusable?: boolean;
        OnMouseCaptureBegin?: () => void;
        OnMouseCaptureEnd?: () => void;
        OnControllerCaptureBegin?: () => void;
        OnControllerCaptureEnd?: () => void;
        OnValueChanged?: (Value: number) => void;
    }

    class SynthKnob extends React.Component<SynthKnobProps> {
        nativePtr: UE.SynthKnob;
    }

    interface ReactWidgetProps extends UserWidgetProps {
    }

    class ReactWidget extends React.Component<ReactWidgetProps> {
        nativePtr: UE.ReactWidget;
    }

    interface AnalogSliderProps extends SliderProps {
        OnAnalogCapture?: (Value: number) => void;
    }

    class AnalogSlider extends React.Component<AnalogSliderProps> {
        nativePtr: UE.AnalogSlider;
    }

    interface CommonActionWidgetProps extends WidgetProps {
        OnInputMethodChanged?: (bUsingGamepad: boolean) => void;
        OnInputIconUpdated?: () => void;
        ProgressMaterialBrush?: RecursivePartial<UE.SlateBrush>;
        ProgressMaterialParam?: string;
        IconRimBrush?: RecursivePartial<UE.SlateBrush>;
        InputActions?: TArray<UE.DataTableRowHandle>;
        InputActionDataRow?: RecursivePartial<UE.DataTableRowHandle>;
        DesignTimeKey?: RecursivePartial<UE.Key>;
        Icon?: RecursivePartial<UE.SlateBrush>;
    }

    class CommonActionWidget extends React.Component<CommonActionWidgetProps> {
        nativePtr: UE.CommonActionWidget;
    }

    interface CommonUserWidgetProps extends UserWidgetProps {
        bDisplayInActionBar?: boolean;
        bConsumePointerInput?: boolean;
    }

    class CommonUserWidget extends React.Component<CommonUserWidgetProps> {
        nativePtr: UE.CommonUserWidget;
    }

    interface CommonActivatableWidgetProps extends CommonUserWidgetProps {
        bIsBackHandler?: boolean;
        bIsBackActionDisplayedInActionBar?: boolean;
        OverrideBackActionDisplayName?: string;
        bAutoActivate?: boolean;
        bSupportsActivationFocus?: boolean;
        bIsModal?: boolean;
        bAutoRestoreFocus?: boolean;
        bOverrideActionDomain?: boolean;
        InputMappingPriority?: number;
        BP_OnWidgetActivated?: () => void;
        BP_OnWidgetDeactivated?: () => void;
        bIsActive?: boolean;
        bSetVisibilityOnActivated?: boolean;
        ActivatedVisibility?: UE.ESlateVisibility;
        bSetVisibilityOnDeactivated?: boolean;
        DeactivatedVisibility?: UE.ESlateVisibility;
    }

    class CommonActivatableWidget extends React.Component<CommonActivatableWidgetProps> {
        nativePtr: UE.CommonActivatableWidget;
    }

    interface CommonAnimatedSwitcherProps extends WidgetSwitcherProps {
        TransitionType?: UE.ECommonSwitcherTransition;
        TransitionCurveType?: UE.ETransitionCurve;
        TransitionDuration?: number;
        TransitionFallbackStrategy?: UE.ECommonSwitcherTransitionFallbackStrategy;
    }

    class CommonAnimatedSwitcher extends React.Component<CommonAnimatedSwitcherProps> {
        nativePtr: UE.CommonAnimatedSwitcher;
    }

    interface CommonActivatableWidgetSwitcherProps extends CommonAnimatedSwitcherProps {
        bClearFocusRestorationTargetOfDeactivatedWidgets?: boolean;
    }

    class CommonActivatableWidgetSwitcher extends React.Component<CommonActivatableWidgetSwitcherProps> {
        nativePtr: UE.CommonActivatableWidgetSwitcher;
    }

    interface CommonBorderProps extends BorderProps {
        bReducePaddingBySafezone?: boolean;
        MinimumPadding?: RecursivePartial<UE.Margin>;
        bStyleNoLongerNeedsConversion?: boolean;
    }

    class CommonBorder extends React.Component<CommonBorderProps> {
        nativePtr: UE.CommonBorder;
    }

    interface CommonButtonInternalBaseProps extends ButtonProps {
        OnDoubleClicked?: () => void;
        MinWidth?: number;
        MinHeight?: number;
        MaxWidth?: number;
        MaxHeight?: number;
        bButtonEnabled?: boolean;
        bInteractionEnabled?: boolean;
    }

    class CommonButtonInternalBase extends React.Component<CommonButtonInternalBaseProps> {
        nativePtr: UE.CommonButtonInternalBase;
    }

    interface CommonButtonBaseProps extends CommonUserWidgetProps {
        ClickEvent?: RecursivePartial<UE.WidgetEventField>;
        MinWidth?: number;
        MinHeight?: number;
        MaxWidth?: number;
        MaxHeight?: number;
        bHideInputAction?: boolean;
        PressedSlateSoundOverride?: RecursivePartial<UE.SlateSound>;
        ClickedSlateSoundOverride?: RecursivePartial<UE.SlateSound>;
        HoveredSlateSoundOverride?: RecursivePartial<UE.SlateSound>;
        SelectedPressedSlateSoundOverride?: RecursivePartial<UE.SlateSound>;
        SelectedClickedSlateSoundOverride?: RecursivePartial<UE.SlateSound>;
        SelectedHoveredSlateSoundOverride?: RecursivePartial<UE.SlateSound>;
        LockedPressedSlateSoundOverride?: RecursivePartial<UE.SlateSound>;
        LockedClickedSlateSoundOverride?: RecursivePartial<UE.SlateSound>;
        LockedHoveredSlateSoundOverride?: RecursivePartial<UE.SlateSound>;
        bApplyAlphaOnDisable?: boolean;
        bLocked?: boolean;
        bSelectable?: boolean;
        bShouldSelectUponReceivingFocus?: boolean;
        bInteractableWhenSelected?: boolean;
        bToggleable?: boolean;
        bTriggerClickedAfterSelection?: boolean;
        bDisplayInputActionWhenNotInteractable?: boolean;
        bHideInputActionWithKeyboard?: boolean;
        bShouldUseFallbackDefaultInputAction?: boolean;
        bRequiresHold?: boolean;
        bSimulateHoverOnTouchInput?: boolean;
        ClickMethod?: UE.EButtonClickMethod;
        TouchMethod?: UE.EButtonTouchMethod;
        PressMethod?: UE.EButtonPressMethod;
        InputPriority?: number;
        TriggeringInputAction?: RecursivePartial<UE.DataTableRowHandle>;
        bStyleNoLongerNeedsConversion?: boolean;
        bNavigateToNextWidgetOnDisable?: boolean;
        bIsPersistentBinding?: boolean;
        InputModeOverride?: UE.ECommonInputMode;
        NormalStyle?: RecursivePartial<UE.ButtonStyle>;
        SelectedStyle?: RecursivePartial<UE.ButtonStyle>;
        DisabledStyle?: RecursivePartial<UE.ButtonStyle>;
        LockedStyle?: RecursivePartial<UE.ButtonStyle>;
        bStopDoubleClickPropagation?: boolean;
    }

    class CommonButtonBase extends React.Component<CommonButtonBaseProps> {
        nativePtr: UE.CommonButtonBase;
    }

    interface CommonCustomNavigationProps extends BorderProps {
        OnNavigationEvent?: (NavigationType: UE.EUINavigation) => boolean;
    }

    class CommonCustomNavigation extends React.Component<CommonCustomNavigationProps> {
        nativePtr: UE.CommonCustomNavigation;
    }

    interface CommonTextBlockProps extends TextBlockProps {
        MobileFontSizeMultiplier?: number;
        bIsScrollingEnabled?: boolean;
        bDisplayAllCaps?: boolean;
        bAutoCollapseWithEmptyText?: boolean;
        ScrollOrientation?: UE.EOrientation;
        bStyleNoLongerNeedsConversion?: boolean;
    }

    class CommonTextBlock extends React.Component<CommonTextBlockProps> {
        nativePtr: UE.CommonTextBlock;
    }

    interface CommonDateTimeTextBlockProps extends CommonTextBlockProps {
        CustomTimespanFormat?: string;
        bCustomTimespanLeadingZeros?: boolean;
    }

    class CommonDateTimeTextBlock extends React.Component<CommonDateTimeTextBlockProps> {
        nativePtr: UE.CommonDateTimeTextBlock;
    }

    interface CommonHardwareVisibilityBorderProps extends CommonBorderProps {
        VisibilityQuery?: RecursivePartial<UE.GameplayTagQuery>;
        VisibleType?: UE.ESlateVisibility;
        HiddenType?: UE.ESlateVisibility;
    }

    class CommonHardwareVisibilityBorder extends React.Component<CommonHardwareVisibilityBorderProps> {
        nativePtr: UE.CommonHardwareVisibilityBorder;
    }

    interface CommonHierarchicalScrollBoxProps extends ScrollBoxProps {
    }

    class CommonHierarchicalScrollBox extends React.Component<CommonHierarchicalScrollBoxProps> {
        nativePtr: UE.CommonHierarchicalScrollBox;
    }

    interface CommonLazyImageProps extends ImageProps {
        bShowLoading?: boolean;
        LoadingBackgroundBrush?: RecursivePartial<UE.SlateBrush>;
        LoadingThrobberBrush?: RecursivePartial<UE.SlateBrush>;
        MaterialTextureParamName?: string;
        BP_OnLoadingStateChanged?: (bIsLoading: boolean) => void;
    }

    class CommonLazyImage extends React.Component<CommonLazyImageProps> {
        nativePtr: UE.CommonLazyImage;
    }

    interface CommonLazyWidgetProps extends WidgetProps {
        LoadingThrobberBrush?: RecursivePartial<UE.SlateBrush>;
        LoadingBackgroundBrush?: RecursivePartial<UE.SlateBrush>;
        BP_OnLoadingStateChanged?: (bIsLoading: boolean) => void;
    }

    class CommonLazyWidget extends React.Component<CommonLazyWidgetProps> {
        nativePtr: UE.CommonLazyWidget;
    }

    interface CommonListViewProps extends ListViewProps {
    }

    class CommonListView extends React.Component<CommonListViewProps> {
        nativePtr: UE.CommonListView;
    }

    interface CommonLoadGuardProps extends ContentWidgetProps {
        bShowLoading?: boolean;
        LoadingBackgroundBrush?: RecursivePartial<UE.SlateBrush>;
        LoadingThrobberBrush?: RecursivePartial<UE.SlateBrush>;
        ThrobberAlignment?: UE.EHorizontalAlignment;
        ThrobberPadding?: RecursivePartial<UE.Margin>;
        LoadingText?: string;
        BP_OnLoadingStateChanged?: (bIsLoading: boolean) => void;
        SpinnerMaterialPath?: RecursivePartial<UE.SoftObjectPath>;
        bStyleNoLongerNeedsConversion?: boolean;
    }

    class CommonLoadGuard extends React.Component<CommonLoadGuardProps> {
        nativePtr: UE.CommonLoadGuard;
    }

    interface CommonNumericTextBlockProps extends CommonTextBlockProps {
        CurrentNumericValue?: number;
        NumericType?: UE.ECommonNumericType;
        FormattingSpecification?: RecursivePartial<UE.CommonNumberFormattingOptions>;
        EaseOutInterpolationExponent?: number;
        InterpolationUpdateInterval?: number;
        PostInterpolationShrinkDuration?: number;
        PerformSizeInterpolation?: boolean;
        IsPercentage?: boolean;
    }

    class CommonNumericTextBlock extends React.Component<CommonNumericTextBlockProps> {
        nativePtr: UE.CommonNumericTextBlock;
    }

    interface CommonRichTextBlockProps extends RichTextBlockProps {
        InlineIconDisplayMode?: UE.ERichTextInlineIconDisplayMode;
        bTintInlineIcon?: boolean;
        MobileTextBlockScale?: number;
        ScrollOrientation?: UE.EOrientation;
        bIsScrollingEnabled?: boolean;
        bDisplayAllCaps?: boolean;
        bAutoCollapseWithEmptyText?: boolean;
    }

    class CommonRichTextBlock extends React.Component<CommonRichTextBlockProps> {
        nativePtr: UE.CommonRichTextBlock;
    }

    interface CommonRotatorProps extends CommonButtonBaseProps {
        OnRotatedWithDirection?: (Value: number, RotatorDir: UE.ERotatorDirection) => void;
        OnRotated?: (Value: number) => void;
    }

    class CommonRotator extends React.Component<CommonRotatorProps> {
        nativePtr: UE.CommonRotator;
    }

    interface CommonTabListWidgetBaseProps extends CommonUserWidgetProps {
        OnTabSelected?: (TabId: string) => void;
        OnTabListRebuilt?: () => void;
        NextTabInputActionData?: RecursivePartial<UE.DataTableRowHandle>;
        PreviousTabInputActionData?: RecursivePartial<UE.DataTableRowHandle>;
        bAutoListenForInput?: boolean;
        bShouldWrapNavigation?: boolean;
        bDeferRebuildingTabList?: boolean;
        RegisteredTabsByID?: TMap<string, UE.CommonRegisteredTabInfo>;
        TabButtonWidgetPool?: RecursivePartial<UE.UserWidgetPool>;
    }

    class CommonTabListWidgetBase extends React.Component<CommonTabListWidgetBaseProps> {
        nativePtr: UE.CommonTabListWidgetBase;
    }

    interface CommonTileViewProps extends TileViewProps {
    }

    class CommonTileView extends React.Component<CommonTileViewProps> {
        nativePtr: UE.CommonTileView;
    }

    interface CommonTreeViewProps extends TreeViewProps {
    }

    class CommonTreeView extends React.Component<CommonTreeViewProps> {
        nativePtr: UE.CommonTreeView;
    }

    interface CommonVideoPlayerProps extends WidgetProps {
        bMatchSize?: boolean;
        VideoBrush?: RecursivePartial<UE.SlateBrush>;
    }

    class CommonVideoPlayer extends React.Component<CommonVideoPlayerProps> {
        nativePtr: UE.CommonVideoPlayer;
    }

    interface CommonVisibilitySwitcherProps extends OverlayProps {
        ShownVisibility?: UE.ESlateVisibility;
        ActiveWidgetIndex?: number;
        bAutoActivateSlot?: boolean;
        bActivateFirstSlotOnAdding?: boolean;
    }

    class CommonVisibilitySwitcher extends React.Component<CommonVisibilitySwitcherProps> {
        nativePtr: UE.CommonVisibilitySwitcher;
    }

    interface UCommonVisibilityWidgetBaseProps extends CommonBorderProps {
        VisibilityControls?: TMap<string, boolean>;
        bShowForGamepad?: boolean;
        bShowForMouseAndKeyboard?: boolean;
        bShowForTouch?: boolean;
        VisibleType?: UE.ESlateVisibility;
        HiddenType?: UE.ESlateVisibility;
    }

    class UCommonVisibilityWidgetBase extends React.Component<UCommonVisibilityWidgetBaseProps> {
        nativePtr: UE.UCommonVisibilityWidgetBase;
    }

    interface CommonVisualAttachmentProps extends SizeBoxProps {
        ContentAnchor?: RecursivePartial<UE.Vector2D>;
    }

    class CommonVisualAttachment extends React.Component<CommonVisualAttachmentProps> {
        nativePtr: UE.CommonVisualAttachment;
    }

    interface CommonWidgetCarouselProps extends PanelWidgetProps {
        ActiveWidgetIndex?: number;
        MoveSpeed?: number;
        bCacheChildren?: boolean;
    }

    class CommonWidgetCarousel extends React.Component<CommonWidgetCarouselProps> {
        nativePtr: UE.CommonWidgetCarousel;
    }

    interface CommonWidgetCarouselNavBarProps extends WidgetProps {
        ButtonPadding?: RecursivePartial<UE.Margin>;
    }

    class CommonWidgetCarouselNavBar extends React.Component<CommonWidgetCarouselNavBarProps> {
        nativePtr: UE.CommonWidgetCarouselNavBar;
    }

    interface CommonBoundActionBarProps extends DynamicEntryBoxBaseProps {
        bDisplayOwningPlayerActionsOnly?: boolean;
        bIgnoreDuplicateActions?: boolean;
        OnActionBarUpdated?: () => void;
    }

    class CommonBoundActionBar extends React.Component<CommonBoundActionBarProps> {
        nativePtr: UE.CommonBoundActionBar;
    }

    interface CommonBoundActionButtonProps extends CommonButtonBaseProps {
        bLinkRequiresHoldToBindingHold?: boolean;
    }

    class CommonBoundActionButton extends React.Component<CommonBoundActionButtonProps> {
        nativePtr: UE.CommonBoundActionButton;
    }

    interface CommonActivatableWidgetContainerBaseProps extends WidgetProps {
        TransitionType?: UE.ECommonSwitcherTransition;
        TransitionCurveType?: UE.ETransitionCurve;
        TransitionDuration?: number;
        bResetPoolWhenReleasingSlateResources?: boolean;
        TransitionFallbackStrategy?: UE.ECommonSwitcherTransitionFallbackStrategy;
        GeneratedWidgetsPool?: RecursivePartial<UE.UserWidgetPool>;
    }

    class CommonActivatableWidgetContainerBase extends React.Component<CommonActivatableWidgetContainerBaseProps> {
        nativePtr: UE.CommonActivatableWidgetContainerBase;
    }

    interface CommonActivatableWidgetStackProps extends CommonActivatableWidgetContainerBaseProps {
    }

    class CommonActivatableWidgetStack extends React.Component<CommonActivatableWidgetStackProps> {
        nativePtr: UE.CommonActivatableWidgetStack;
    }

    interface CommonActivatableWidgetQueueProps extends CommonActivatableWidgetContainerBaseProps {
    }

    class CommonActivatableWidgetQueue extends React.Component<CommonActivatableWidgetQueueProps> {
        nativePtr: UE.CommonActivatableWidgetQueue;
    }

    interface GameSettingDetailExtensionProps extends UserWidgetProps {
    }

    class GameSettingDetailExtension extends React.Component<GameSettingDetailExtensionProps> {
        nativePtr: UE.GameSettingDetailExtension;
    }

    interface GameSettingDetailViewProps extends UserWidgetProps {
        ExtensionWidgetPool?: RecursivePartial<UE.UserWidgetPool>;
    }

    class GameSettingDetailView extends React.Component<GameSettingDetailViewProps> {
        nativePtr: UE.GameSettingDetailView;
    }

    interface GameSettingListEntryBaseProps extends CommonUserWidgetProps {
    }

    class GameSettingListEntryBase extends React.Component<GameSettingListEntryBaseProps> {
        nativePtr: UE.GameSettingListEntryBase;
    }

    interface GameSettingListEntry_SettingProps extends GameSettingListEntryBaseProps {
    }

    class GameSettingListEntry_Setting extends React.Component<GameSettingListEntry_SettingProps> {
        nativePtr: UE.GameSettingListEntry_Setting;
    }

    interface GameSettingListEntrySetting_DiscreteProps extends GameSettingListEntry_SettingProps {
    }

    class GameSettingListEntrySetting_Discrete extends React.Component<GameSettingListEntrySetting_DiscreteProps> {
        nativePtr: UE.GameSettingListEntrySetting_Discrete;
    }

    interface GameSettingListEntrySetting_ScalarProps extends GameSettingListEntry_SettingProps {
    }

    class GameSettingListEntrySetting_Scalar extends React.Component<GameSettingListEntrySetting_ScalarProps> {
        nativePtr: UE.GameSettingListEntrySetting_Scalar;
    }

    interface GameSettingListEntrySetting_ActionProps extends GameSettingListEntry_SettingProps {
    }

    class GameSettingListEntrySetting_Action extends React.Component<GameSettingListEntrySetting_ActionProps> {
        nativePtr: UE.GameSettingListEntrySetting_Action;
    }

    interface GameSettingListEntrySetting_NavigationProps extends GameSettingListEntry_SettingProps {
    }

    class GameSettingListEntrySetting_Navigation extends React.Component<GameSettingListEntrySetting_NavigationProps> {
        nativePtr: UE.GameSettingListEntrySetting_Navigation;
    }

    interface GameSettingListViewProps extends ListViewProps {
    }

    class GameSettingListView extends React.Component<GameSettingListViewProps> {
        nativePtr: UE.GameSettingListView;
    }

    interface GameSettingPanelProps extends CommonUserWidgetProps {
        FilterState?: RecursivePartial<UE.GameSettingFilterState>;
        FilterNavigationStack?: TArray<UE.GameSettingFilterState>;
    }

    class GameSettingPanel extends React.Component<GameSettingPanelProps> {
        nativePtr: UE.GameSettingPanel;
    }

    interface GameSettingScreenProps extends CommonActivatableWidgetProps {
    }

    class GameSettingScreen extends React.Component<GameSettingScreenProps> {
        nativePtr: UE.GameSettingScreen;
    }

    interface GameSettingPressAnyKeyProps extends CommonActivatableWidgetProps {
    }

    class GameSettingPressAnyKey extends React.Component<GameSettingPressAnyKeyProps> {
        nativePtr: UE.GameSettingPressAnyKey;
    }

    interface GameSettingRotatorProps extends CommonRotatorProps {
    }

    class GameSettingRotator extends React.Component<GameSettingRotatorProps> {
        nativePtr: UE.GameSettingRotator;
    }

    interface KeyAlreadyBoundWarningProps extends GameSettingPressAnyKeyProps {
    }

    class KeyAlreadyBoundWarning extends React.Component<KeyAlreadyBoundWarningProps> {
        nativePtr: UE.KeyAlreadyBoundWarning;
    }

    interface GameResponsivePanelProps extends PanelWidgetProps {
        bCanStackVertically?: boolean;
    }

    class GameResponsivePanel extends React.Component<GameResponsivePanelProps> {
        nativePtr: UE.GameResponsivePanel;
    }

    interface CommonPlayerInputKeyProps extends CommonUserWidgetProps {
        BoundAction?: string;
        AxisScale?: number;
        BoundKeyFallback?: RecursivePartial<UE.Key>;
        InputTypeOverride?: UE.ECommonInputType;
        PresetNameOverride?: string;
        ForcedHoldKeybindStatus?: UE.ECommonKeybindForcedHoldStatus;
        bIsHoldKeybind?: boolean;
        bShowKeybindBorder?: boolean;
        FrameSize?: RecursivePartial<UE.Vector2D>;
        bShowTimeCountDown?: boolean;
        BoundKey?: RecursivePartial<UE.Key>;
        HoldProgressBrush?: RecursivePartial<UE.SlateBrush>;
        KeyBindTextBorder?: RecursivePartial<UE.SlateBrush>;
        bShowUnboundStatus?: boolean;
        KeyBindTextFont?: RecursivePartial<UE.SlateFontInfo>;
        CountdownTextFont?: RecursivePartial<UE.SlateFontInfo>;
        CountdownText?: RecursivePartial<UE.MeasuredText>;
        KeybindText?: RecursivePartial<UE.MeasuredText>;
        KeybindTextPadding?: RecursivePartial<UE.Margin>;
        KeybindFrameMinimumSize?: RecursivePartial<UE.Vector2D>;
        PercentageMaterialParameterName?: string;
        CachedKeyBrush?: RecursivePartial<UE.SlateBrush>;
    }

    class CommonPlayerInputKey extends React.Component<CommonPlayerInputKeyProps> {
        nativePtr: UE.CommonPlayerInputKey;
    }

    interface PrimaryGameLayoutProps extends CommonUserWidgetProps {
        Layers?: TMap<UE.GameplayTag, UE.CommonActivatableWidgetContainerBase>;
    }

    class PrimaryGameLayout extends React.Component<PrimaryGameLayoutProps> {
        nativePtr: UE.PrimaryGameLayout;
    }

    interface CommonGameDialogProps extends CommonActivatableWidgetProps {
    }

    class CommonGameDialog extends React.Component<CommonGameDialogProps> {
        nativePtr: UE.CommonGameDialog;
    }

    interface SubtitleDisplayProps extends WidgetProps {
        Format?: RecursivePartial<UE.SubtitleFormat>;
        WrapTextAt?: number;
        bPreviewMode?: boolean;
        PreviewText?: string;
        GeneratedStyle?: RecursivePartial<UE.TextBlockStyle>;
        GeneratedBackgroundBorder?: RecursivePartial<UE.SlateBrush>;
    }

    class SubtitleDisplay extends React.Component<SubtitleDisplayProps> {
        nativePtr: UE.SubtitleDisplay;
    }

    interface UIExtensionPointWidgetProps extends DynamicEntryBoxBaseProps {
        ExtensionPointTag?: RecursivePartial<UE.GameplayTag>;
        ExtensionPointTagMatch?: UE.EUIExtensionPointMatch;
        ExtensionMapping?: TMap<UE.UIExtensionHandle, UE.UserWidget>;
    }

    class UIExtensionPointWidget extends React.Component<UIExtensionPointWidgetProps> {
        nativePtr: UE.UIExtensionPointWidget;
    }

    interface LyraBrightnessEditorProps extends CommonActivatableWidgetProps {
        bCanCancel?: boolean;
    }

    class LyraBrightnessEditor extends React.Component<LyraBrightnessEditorProps> {
        nativePtr: UE.LyraBrightnessEditor;
    }

    interface LyraHDRCalibrationEditorProps extends CommonActivatableWidgetProps {
        bCanCancel?: boolean;
    }

    class LyraHDRCalibrationEditor extends React.Component<LyraHDRCalibrationEditorProps> {
        nativePtr: UE.LyraHDRCalibrationEditor;
    }

    interface LyraSafeZoneEditorProps extends CommonActivatableWidgetProps {
        bCanCancel?: boolean;
    }

    class LyraSafeZoneEditor extends React.Component<LyraSafeZoneEditorProps> {
        nativePtr: UE.LyraSafeZoneEditor;
    }

    interface LyraSettingsListEntrySetting_KeyboardInputProps extends GameSettingListEntry_SettingProps {
        OriginalKeyToBind?: RecursivePartial<UE.Key>;
    }

    class LyraSettingsListEntrySetting_KeyboardInput extends React.Component<LyraSettingsListEntrySetting_KeyboardInputProps> {
        nativePtr: UE.LyraSettingsListEntrySetting_KeyboardInput;
    }

    interface LyraActivatableWidgetProps extends CommonActivatableWidgetProps {
        InputConfig?: UE.ELyraWidgetInputMode;
        GameMouseCaptureMode?: UE.EMouseCaptureMode;
    }

    class LyraActivatableWidget extends React.Component<LyraActivatableWidgetProps> {
        nativePtr: UE.LyraActivatableWidget;
    }

    interface LyraHUDLayoutProps extends LyraActivatableWidgetProps {
        PlatformRequiresControllerDisconnectScreen?: RecursivePartial<UE.GameplayTagContainer>;
    }

    class LyraHUDLayout extends React.Component<LyraHUDLayoutProps> {
        nativePtr: UE.LyraHUDLayout;
    }

    interface LyraSimulatedInputWidgetProps extends CommonUserWidgetProps {
        FallbackBindingKey?: RecursivePartial<UE.Key>;
    }

    class LyraSimulatedInputWidget extends React.Component<LyraSimulatedInputWidgetProps> {
        nativePtr: UE.LyraSimulatedInputWidget;
    }

    interface LyraJoystickWidgetProps extends LyraSimulatedInputWidgetProps {
        StickRange?: number;
        bNegateYAxis?: boolean;
        TouchOrigin?: RecursivePartial<UE.Vector2D>;
        StickVector?: RecursivePartial<UE.Vector2D>;
    }

    class LyraJoystickWidget extends React.Component<LyraJoystickWidgetProps> {
        nativePtr: UE.LyraJoystickWidget;
    }

    interface LyraSettingScreenProps extends GameSettingScreenProps {
        BackInputActionData?: RecursivePartial<UE.DataTableRowHandle>;
        ApplyInputActionData?: RecursivePartial<UE.DataTableRowHandle>;
        CancelChangesInputActionData?: RecursivePartial<UE.DataTableRowHandle>;
    }

    class LyraSettingScreen extends React.Component<LyraSettingScreenProps> {
        nativePtr: UE.LyraSettingScreen;
    }

    interface LyraTaggedWidgetProps extends CommonUserWidgetProps {
        HiddenByTags?: RecursivePartial<UE.GameplayTagContainer>;
        ShownVisibility?: UE.ESlateVisibility;
        HiddenVisibility?: UE.ESlateVisibility;
    }

    class LyraTaggedWidget extends React.Component<LyraTaggedWidgetProps> {
        nativePtr: UE.LyraTaggedWidget;
    }

    interface LyraTouchRegionProps extends LyraSimulatedInputWidgetProps {
    }

    class LyraTouchRegion extends React.Component<LyraTouchRegionProps> {
        nativePtr: UE.LyraTouchRegion;
    }

    interface MaterialProgressBarProps extends CommonUserWidgetProps {
        OnFillAnimationFinished?: () => void;
        bOverrideDefaultColorA?: boolean;
        CachedColorA?: RecursivePartial<UE.LinearColor>;
        bOverrideDefaultColorB?: boolean;
        CachedColorB?: RecursivePartial<UE.LinearColor>;
        bOverrideDefaultColorBackground?: boolean;
        CachedColorBackground?: RecursivePartial<UE.LinearColor>;
        bOverrideDefaultSegments?: boolean;
        Segments?: number;
        bOverrideDefaultSegmentEdge?: boolean;
        SegmentEdge?: number;
        bOverrideDefaultFillEdgeSoftness?: boolean;
        FillEdgeSoftness?: number;
        bOverrideDefaultGlowEdge?: boolean;
        GlowEdge?: number;
        bOverrideDefaultGlowSoftness?: boolean;
        GlowSoftness?: number;
        bOverrideDefaultOutlineScale?: boolean;
        OutlineScale?: number;
        bUseStroke?: boolean;
        DesignTime_Progress?: number;
    }

    class MaterialProgressBar extends React.Component<MaterialProgressBarProps> {
        nativePtr: UE.MaterialProgressBar;
    }

    interface LyraBoundActionButtonProps extends CommonBoundActionButtonProps {
    }

    class LyraBoundActionButton extends React.Component<LyraBoundActionButtonProps> {
        nativePtr: UE.LyraBoundActionButton;
    }

    interface LyraListViewProps extends CommonListViewProps {
    }

    class LyraListView extends React.Component<LyraListViewProps> {
        nativePtr: UE.LyraListView;
    }

    interface LyraButtonBaseProps extends CommonButtonBaseProps {
        bOverride_ButtonText?: boolean;
        ButtonText?: string;
    }

    class LyraButtonBase extends React.Component<LyraButtonBaseProps> {
        nativePtr: UE.LyraButtonBase;
    }

    interface LyraTabButtonBaseProps extends LyraButtonBaseProps {
    }

    class LyraTabButtonBase extends React.Component<LyraTabButtonBaseProps> {
        nativePtr: UE.LyraTabButtonBase;
    }

    interface LyraTabListWidgetBaseProps extends CommonTabListWidgetBaseProps {
        PreregisteredTabInfoArray?: TArray<UE.LyraTabDescriptor>;
        PendingTabLabelInfoMap?: TMap<string, UE.LyraTabDescriptor>;
    }

    class LyraTabListWidgetBase extends React.Component<LyraTabListWidgetBaseProps> {
        nativePtr: UE.LyraTabListWidgetBase;
    }

    interface LyraActionWidgetProps extends CommonActionWidgetProps {
    }

    class LyraActionWidget extends React.Component<LyraActionWidgetProps> {
        nativePtr: UE.LyraActionWidget;
    }

    interface LyraConfirmationScreenProps extends CommonGameDialogProps {
        CancelAction?: RecursivePartial<UE.DataTableRowHandle>;
    }

    class LyraConfirmationScreen extends React.Component<LyraConfirmationScreenProps> {
        nativePtr: UE.LyraConfirmationScreen;
    }

    interface LyraControllerDisconnectedScreenProps extends CommonActivatableWidgetProps {
        PlatformSupportsUserChangeTags?: RecursivePartial<UE.GameplayTagContainer>;
    }

    class LyraControllerDisconnectedScreen extends React.Component<LyraControllerDisconnectedScreenProps> {
        nativePtr: UE.LyraControllerDisconnectedScreen;
    }

    interface IndicatorLayerProps extends WidgetProps {
        ArrowBrush?: RecursivePartial<UE.SlateBrush>;
    }

    class IndicatorLayer extends React.Component<IndicatorLayerProps> {
        nativePtr: UE.IndicatorLayer;
    }

    interface LyraPerfStatContainerBaseProps extends CommonUserWidgetProps {
        StatDisplayModeFilter?: UE.ELyraStatDisplayMode;
    }

    class LyraPerfStatContainerBase extends React.Component<LyraPerfStatContainerBaseProps> {
        nativePtr: UE.LyraPerfStatContainerBase;
    }

    interface LyraPerfStatGraphProps extends UserWidgetProps {
    }

    class LyraPerfStatGraph extends React.Component<LyraPerfStatGraphProps> {
        nativePtr: UE.LyraPerfStatGraph;
    }

    interface LyraPerfStatWidgetBaseProps extends CommonUserWidgetProps {
        GraphLineColor?: RecursivePartial<UE.Color>;
        GraphBackgroundColor?: RecursivePartial<UE.Color>;
        GraphMaxYValue?: number;
        StatToDisplay?: UE.ELyraDisplayablePerformanceStat;
    }

    class LyraPerfStatWidgetBase extends React.Component<LyraPerfStatWidgetBaseProps> {
        nativePtr: UE.LyraPerfStatWidgetBase;
    }

    interface CircumferenceMarkerWidgetProps extends WidgetProps {
        MarkerList?: TArray<UE.CircumferenceMarkerEntry>;
        Radius?: number;
        MarkerImage?: RecursivePartial<UE.SlateBrush>;
        bReticleCornerOutsideSpreadRadius?: boolean;
    }

    class CircumferenceMarkerWidget extends React.Component<CircumferenceMarkerWidgetProps> {
        nativePtr: UE.CircumferenceMarkerWidget;
    }

    interface HitMarkerConfirmationWidgetProps extends WidgetProps {
        HitNotifyDuration?: number;
        PerHitMarkerImage?: RecursivePartial<UE.SlateBrush>;
        PerHitMarkerZoneOverrideImages?: TMap<UE.GameplayTag, UE.SlateBrush>;
        AnyHitsMarkerImage?: RecursivePartial<UE.SlateBrush>;
    }

    class HitMarkerConfirmationWidget extends React.Component<HitMarkerConfirmationWidgetProps> {
        nativePtr: UE.HitMarkerConfirmationWidget;
    }

    interface LyraReticleWidgetBaseProps extends CommonUserWidgetProps {
    }

    class LyraReticleWidgetBase extends React.Component<LyraReticleWidgetBaseProps> {
        nativePtr: UE.LyraReticleWidgetBase;
    }

    interface LyraWeaponUserInterfaceProps extends CommonUserWidgetProps {
    }

    class LyraWeaponUserInterface extends React.Component<LyraWeaponUserInterfaceProps> {
        nativePtr: UE.LyraWeaponUserInterface;
    }

    interface NamingTokensEditableTextProps extends MultiLineEditableTextProps {
        FilterArgs?: RecursivePartial<UE.NamingTokenFilterArgs>;
        NamespaceSuggestionPriority?: TArray<string>;
        bEnableSuggestionDropdown?: boolean;
        bFullyQualifyFilteredNamespaces?: boolean;
        bIsMultiline?: boolean;
        bDisplayTokenIcon?: boolean;
        bDisplayErrorMessage?: boolean;
        bDisplayBorderImage?: boolean;
        ArgumentStyle?: RecursivePartial<UE.TextBlockStyle>;
        BackgroundColor?: RecursivePartial<UE.SlateColor>;
        bCanDisplayResolvedText?: boolean;
        bShowUnknownTokenWarning?: boolean;
        bShowUnsetTokenWarning?: boolean;
        bDisplayResolvedTextInDesigner?: boolean;
        OnPreEvaluateNamingTokens?: () => void;
    }

    class NamingTokensEditableText extends React.Component<NamingTokensEditableTextProps> {
        nativePtr: UE.NamingTokensEditableText;
    }

    interface MVVMWidgetFieldPathHelperTestProps extends UserWidgetProps {
        PropertyInt?: number;
        PropertyIntWithGetterSetter?: number;
        PropertyIntWithGetterSetterAndBP?: number;
        PropertyIntWithBPGetterSetter?: number;
        PropertyIntNotify?: number;
        PropertyVector?: RecursivePartial<UE.Vector>;
        PropertyVectorWithGetterSetter?: RecursivePartial<UE.Vector>;
        PropertyVectorWithGetterSetterAndBP?: RecursivePartial<UE.Vector>;
        PropertyVectorWithBPGetterSetter?: RecursivePartial<UE.Vector>;
        PropertyVectorNotify?: RecursivePartial<UE.Vector>;
        PropertyStruct?: RecursivePartial<UE.MVVMStructFieldPathHelperTest>;
        PropertyStructWithGetterSetter?: RecursivePartial<UE.MVVMStructFieldPathHelperTest>;
        PropertyStructWithGetterSetterAndBP?: RecursivePartial<UE.MVVMStructFieldPathHelperTest>;
        PropertyStructWithBPGetterSetter?: RecursivePartial<UE.MVVMStructFieldPathHelperTest>;
        PropertyStructNotify?: RecursivePartial<UE.MVVMStructFieldPathHelperTest>;
    }

    class MVVMWidgetFieldPathHelperTest extends React.Component<MVVMWidgetFieldPathHelperTestProps> {
        nativePtr: UE.MVVMWidgetFieldPathHelperTest;
    }

    interface ObjectMixerEditorUWidgetProps extends WidgetProps {
        ObjectMixerWidgetUserConfig?: RecursivePartial<UE.ObjectMixerWidgetUserConfig>;
    }

    class ObjectMixerEditorUWidget extends React.Component<ObjectMixerEditorUWidgetProps> {
        nativePtr: UE.ObjectMixerEditorUWidget;
    }

    interface MovieGraphBurnInWidgetProps extends UserWidgetProps {
    }

    class MovieGraphBurnInWidget extends React.Component<MovieGraphBurnInWidgetProps> {
        nativePtr: UE.MovieGraphBurnInWidget;
    }

    interface MovieRenderDebugWidgetProps extends UserWidgetProps {
    }

    class MovieRenderDebugWidget extends React.Component<MovieRenderDebugWidgetProps> {
        nativePtr: UE.MovieRenderDebugWidget;
    }

    interface MovieGraphRenderPreviewWidgetProps extends UserWidgetProps {
    }

    class MovieGraphRenderPreviewWidget extends React.Component<MovieGraphRenderPreviewWidgetProps> {
        nativePtr: UE.MovieGraphRenderPreviewWidget;
    }

    interface MoviePipelineBurnInWidgetProps extends UserWidgetProps {
    }

    class MoviePipelineBurnInWidget extends React.Component<MoviePipelineBurnInWidgetProps> {
        nativePtr: UE.MoviePipelineBurnInWidget;
    }

    interface LyraAccoladeHostWidgetProps extends CommonUserWidgetProps {
        LocationName?: RecursivePartial<UE.GameplayTag>;
        PendingAccoladeLoads?: TArray<UE.PendingAccoladeEntry>;
        PendingAccoladeDisplays?: TArray<UE.PendingAccoladeEntry>;
    }

    class LyraAccoladeHostWidget extends React.Component<LyraAccoladeHostWidgetProps> {
        nativePtr: UE.LyraAccoladeHostWidget;
    }

    interface UMGTestWidgetWithBindingsProps extends UserWidgetProps {
    }

    class UMGTestWidgetWithBindings extends React.Component<UMGTestWidgetWithBindingsProps> {
        nativePtr: UE.UMGTestWidgetWithBindings;
    }

    interface InputActionWidget_CProps extends LyraActionWidgetProps {
    }

    class InputActionWidget_C extends React.Component<InputActionWidget_CProps> {
        nativePtr: UE.Game.UI.Foundation.Widgets.InputActionWidget.InputActionWidget_C;
    }

    interface LyraScrollBox_CProps extends ScrollBoxProps {
    }

    class LyraScrollBox_C extends React.Component<LyraScrollBox_CProps> {
        nativePtr: UE.Game.UI.Menu.LyraScrollBox.LyraScrollBox_C;
    }

    interface LandmassViewport_CProps extends ViewportProps {
    }

    class LandmassViewport_C extends React.Component<LandmassViewport_CProps> {
        nativePtr: UE.Landmass.Landscape.BlueprintBrushes.Widgets.LandmassViewport.LandmassViewport_C;
    }

    interface UIExperienceMacros_CProps extends UserWidgetProps {
    }

    class UIExperienceMacros_C extends React.Component<UIExperienceMacros_CProps> {
        nativePtr: UE.Game.UI.Menu.Experiences.UIExperienceMacros.UIExperienceMacros_C;
    }

    interface W_ArrowCursor_CProps extends UserWidgetProps {
    }

    class W_ArrowCursor_C extends React.Component<W_ArrowCursor_CProps> {
        nativePtr: UE.Game.UI.Foundation.SoftwareCursors.W_ArrowCursor.W_ArrowCursor_C;
    }

    interface W_WaitingForPlayers_Message_CProps extends UserWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
        CountdownStarted?: boolean;
    }

    class W_WaitingForPlayers_Message_C extends React.Component<W_WaitingForPlayers_Message_CProps> {
        nativePtr: UE.ShooterCore.GameplayCues.W_WaitingForPlayers_Message.W_WaitingForPlayers_Message_C;
    }

    interface W_GetReady_CProps extends LyraActivatableWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
    }

    class W_GetReady_C extends React.Component<W_GetReady_CProps> {
        nativePtr: UE.TopDownArena.GameplayCues.W_GetReady.W_GetReady_C;
    }

    interface W_MatchDecided_Message_CProps extends UserWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
        Team?: number;
    }

    class W_MatchDecided_Message_C extends React.Component<W_MatchDecided_Message_CProps> {
        nativePtr: UE.ShooterCore.GameplayCues.W_MatchDecided_Message.W_MatchDecided_Message_C;
    }

    interface W_ExperienceTile_CProps extends CommonUserWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
        ExperienceDisplayName?: string;
        MapToLoad?: RecursivePartial<UE.SoftObjectPath>;
    }

    class W_ExperienceTile_C extends React.Component<W_ExperienceTile_CProps> {
        nativePtr: UE.Game.UI.Menu.Experiences.W_ExperienceTile.W_ExperienceTile_C;
    }

    interface W_LyraExperienceTileButton_CProps extends LyraButtonBaseProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
        PressProgress?: number;
        IsDisabled?: boolean;
    }

    class W_LyraExperienceTileButton_C extends React.Component<W_LyraExperienceTileButton_CProps> {
        nativePtr: UE.Game.UI.Menu.W_LyraExperienceTileButton.W_LyraExperienceTileButton_C;
    }

    interface W_Powerup_Stat_CProps extends UserWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
        Attribute?: RecursivePartial<UE.GameplayAttribute>;
    }

    class W_Powerup_Stat_C extends React.Component<W_Powerup_Stat_CProps> {
        nativePtr: UE.TopDownArena.UserInterface.Player.W_Powerup_Stat.W_Powerup_Stat_C;
    }

    interface W_PlayerTile_CProps extends UserWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
    }

    class W_PlayerTile_C extends React.Component<W_PlayerTile_CProps> {
        nativePtr: UE.TopDownArena.UserInterface.Player.W_PlayerTile.W_PlayerTile_C;
    }

    interface W_RoundTimer_CProps extends LyraTaggedWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
    }

    class W_RoundTimer_C extends React.Component<W_RoundTimer_CProps> {
        nativePtr: UE.TopDownArena.UserInterface.W_RoundTimer.W_RoundTimer_C;
    }

    interface W_TopDownPlayers_CProps extends UserWidgetProps {
    }

    class W_TopDownPlayers_C extends React.Component<W_TopDownPlayers_CProps> {
        nativePtr: UE.TopDownArena.UserInterface.W_TopDownPlayers.W_TopDownPlayers_C;
    }

    interface W_SubtitleDisplayHost_CProps extends CommonUserWidgetProps {
    }

    class W_SubtitleDisplayHost_C extends React.Component<W_SubtitleDisplayHost_CProps> {
        nativePtr: UE.Game.UI.Foundation.Subtitles.W_SubtitleDisplayHost.W_SubtitleDisplayHost_C;
    }

    interface W_TopDownArenaHUDLayout_CProps extends LyraHUDLayoutProps {
    }

    class W_TopDownArenaHUDLayout_C extends React.Component<W_TopDownArenaHUDLayout_CProps> {
        nativePtr: UE.TopDownArena.UserInterface.W_TopDownArenaHUDLayout.W_TopDownArenaHUDLayout_C;
    }

    interface W_DashCooldown_CProps extends UserWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
        CooldownTimer?: RecursivePartial<UE.TimerHandle>;
        Duration?: number;
        StartTime?: number;
        Charging?: boolean;
    }

    class W_DashCooldown_C extends React.Component<W_DashCooldown_CProps> {
        nativePtr: UE.ShooterCore.Game.Dash.W_DashCooldown.W_DashCooldown_C;
    }

    interface W_AmmoCounter_Pistol_CProps extends LyraReticleWidgetBaseProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
    }

    class W_AmmoCounter_Pistol_C extends React.Component<W_AmmoCounter_Pistol_CProps> {
        nativePtr: UE.ShooterCore.Weapons.Pistol.W_AmmoCounter_Pistol.W_AmmoCounter_Pistol_C;
    }

    interface W_Reticle_Pistol_CProps extends LyraReticleWidgetBaseProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
        ActualChannel?: RecursivePartial<UE.GameplayTag>;
    }

    class W_Reticle_Pistol_C extends React.Component<W_Reticle_Pistol_CProps> {
        nativePtr: UE.ShooterCore.Weapons.Pistol.W_Reticle_Pistol.W_Reticle_Pistol_C;
    }

    interface W_ActionTouchButton_CProps extends LyraButtonBaseProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
        CooldownTimer?: RecursivePartial<UE.TimerHandle>;
        Duration?: number;
        StartTime?: number;
        Charging?: boolean;
        DurationMessageTag?: RecursivePartial<UE.GameplayTag>;
        HitTestPadding?: RecursivePartial<UE.Margin>;
        UseBacking?: boolean;
        UseShadow?: boolean;
        UseBlur?: boolean;
        UseGlow?: boolean;
        UseGlowBoost?: boolean;
        IsToggleButton?: boolean;
        HasCooldown?: boolean;
        ButtonBrush?: RecursivePartial<UE.SlateBrush>;
        IsDisabled?: boolean;
        ButtonGlowBrush?: RecursivePartial<UE.SlateBrush>;
        GlowOverdraw?: RecursivePartial<UE.Margin>;
        BlurPadding?: RecursivePartial<UE.Margin>;
        BlurCornerRadius?: number;
    }

    class W_ActionTouchButton_C extends React.Component<W_ActionTouchButton_CProps> {
        nativePtr: UE.Game.UI.Hud.W_ActionTouchButton.W_ActionTouchButton_C;
    }

    interface W_DashTouchButton_CProps extends UserWidgetProps {
    }

    class W_DashTouchButton_C extends React.Component<W_DashTouchButton_CProps> {
        nativePtr: UE.ShooterCore.Game.Dash.W_DashTouchButton.W_DashTouchButton_C;
    }

    interface W_GrenadeCooldown_CProps extends UserWidgetProps {
    }

    class W_GrenadeCooldown_C extends React.Component<W_GrenadeCooldown_CProps> {
        nativePtr: UE.ShooterCore.Weapons.Grenade.W_GrenadeCooldown.W_GrenadeCooldown_C;
    }

    interface W_ActionTouchButton_MobileOnly_CProps extends W_ActionTouchButton_CProps {
    }

    class W_ActionTouchButton_MobileOnly_C extends React.Component<W_ActionTouchButton_MobileOnly_CProps> {
        nativePtr: UE.Game.UI.Hud.W_ActionTouchButton_MobileOnly.W_ActionTouchButton_MobileOnly_C;
    }

    interface W_EmoteTouchButton_CProps extends UserWidgetProps {
    }

    class W_EmoteTouchButton_C extends React.Component<W_EmoteTouchButton_CProps> {
        nativePtr: UE.ShooterCore.Game.Emote.W_EmoteTouchButton.W_EmoteTouchButton_C;
    }

    interface W_JumpTouchButton_CProps extends UserWidgetProps {
    }

    class W_JumpTouchButton_C extends React.Component<W_JumpTouchButton_CProps> {
        nativePtr: UE.Game.Characters.Heroes.Abilities.W_JumpTouchButton.W_JumpTouchButton_C;
    }

    interface W_ToggleADSTouchButton_CProps extends UserWidgetProps {
    }

    class W_ToggleADSTouchButton_C extends React.Component<W_ToggleADSTouchButton_CProps> {
        nativePtr: UE.ShooterCore.UserInterface.W_ToggleADSTouchButton.W_ToggleADSTouchButton_C;
    }

    interface W_MeleeTouchButton_CProps extends UserWidgetProps {
    }

    class W_MeleeTouchButton_C extends React.Component<W_MeleeTouchButton_CProps> {
        nativePtr: UE.ShooterCore.Game.Melee.W_MeleeTouchButton.W_MeleeTouchButton_C;
    }

    interface WBP_VirtualPointer_CProps extends CommonUserWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
    }

    class WBP_VirtualPointer_C extends React.Component<WBP_VirtualPointer_CProps> {
        nativePtr: UE.CommonUI.WBP_VirtualPointer.WBP_VirtualPointer_C;
    }

    interface W_AspectImageWithBlur_CProps extends UserWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
        DisplayBrush?: RecursivePartial<UE.SlateBrush>;
    }

    class W_AspectImageWithBlur_C extends React.Component<W_AspectImageWithBlur_CProps> {
        nativePtr: UE.Game.UI.Foundation.Widgets.W_AspectImageWithBlur.W_AspectImageWithBlur_C;
    }

    interface W_LoadingScreen_ControlPoint_CProps extends UserWidgetProps {
    }

    class W_LoadingScreen_ControlPoint_C extends React.Component<W_LoadingScreen_ControlPoint_CProps> {
        nativePtr: UE.ShooterMaps.System.Playlists.W_LoadingScreen_ControlPoint.W_LoadingScreen_ControlPoint_C;
    }

    interface W_LoadingScreen_TDM_CProps extends UserWidgetProps {
    }

    class W_LoadingScreen_TDM_C extends React.Component<W_LoadingScreen_TDM_CProps> {
        nativePtr: UE.ShooterMaps.System.Playlists.W_LoadingScreen_TDM.W_LoadingScreen_TDM_C;
    }

    interface W_InteractionPrompt_CProps extends UserWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
    }

    class W_InteractionPrompt_C extends React.Component<W_InteractionPrompt_CProps> {
        nativePtr: UE.ShooterExplorer.UserInterface.W_InteractionPrompt.W_InteractionPrompt_C;
    }

    interface W_InventoryTile_CProps extends UserWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
    }

    class W_InventoryTile_C extends React.Component<W_InventoryTile_CProps> {
        nativePtr: UE.ShooterExplorer.UserInterface.W_InventoryTile.W_InventoryTile_C;
    }

    interface W_InventoryGrid_CProps extends UserWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
    }

    class W_InventoryGrid_C extends React.Component<W_InventoryGrid_CProps> {
        nativePtr: UE.ShooterExplorer.UserInterface.W_InventoryGrid.W_InventoryGrid_C;
    }

    interface W_ItemAcquiredToastRow_CProps extends UserWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
    }

    class W_ItemAcquiredToastRow_C extends React.Component<W_ItemAcquiredToastRow_CProps> {
        nativePtr: UE.ShooterExplorer.UserInterface.W_ItemAcquiredToastRow.W_ItemAcquiredToastRow_C;
    }

    interface W_ItemAcquiredList_CProps extends UserWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
    }

    class W_ItemAcquiredList_C extends React.Component<W_ItemAcquiredList_CProps> {
        nativePtr: UE.ShooterExplorer.UserInterface.W_ItemAcquiredList.W_ItemAcquiredList_C;
    }

    interface W_InventoryScreen_CProps extends CommonActivatableWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
    }

    class W_InventoryScreen_C extends React.Component<W_InventoryScreen_CProps> {
        nativePtr: UE.ShooterExplorer.UserInterface.W_InventoryScreen.W_InventoryScreen_C;
    }

    interface W_MapScreen_CProps extends CommonActivatableWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
    }

    class W_MapScreen_C extends React.Component<W_MapScreen_CProps> {
        nativePtr: UE.ShooterExplorer.UserInterface.W_MapScreen.W_MapScreen_C;
    }

    interface W_AmmoCounter_Rifle_CProps extends LyraReticleWidgetBaseProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
    }

    class W_AmmoCounter_Rifle_C extends React.Component<W_AmmoCounter_Rifle_CProps> {
        nativePtr: UE.ShooterCore.Weapons.Rifle.W_AmmoCounter_Rifle.W_AmmoCounter_Rifle_C;
    }

    interface W_Reticle_Rifle_CProps extends LyraReticleWidgetBaseProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
    }

    class W_Reticle_Rifle_C extends React.Component<W_Reticle_Rifle_CProps> {
        nativePtr: UE.ShooterCore.Weapons.Rifle.W_Reticle_Rifle.W_Reticle_Rifle_C;
    }

    interface TextEditBeamCursor_CProps extends UserWidgetProps {
    }

    class TextEditBeamCursor_C extends React.Component<TextEditBeamCursor_CProps> {
        nativePtr: UE.PixelStreaming2.TextEditBeamCursor.TextEditBeamCursor_C;
    }

    interface HiddenCursor_CProps extends UserWidgetProps {
    }

    class HiddenCursor_C extends React.Component<HiddenCursor_CProps> {
        nativePtr: UE.PixelStreaming2.HiddenCursor.HiddenCursor_C;
    }

    interface DefaultCursor_CProps extends UserWidgetProps {
    }

    class DefaultCursor_C extends React.Component<DefaultCursor_CProps> {
        nativePtr: UE.PixelStreaming2.DefaultCursor.DefaultCursor_C;
    }

    interface W_BasePlayerRow_CProps extends UserWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
    }

    class W_BasePlayerRow_C extends React.Component<W_BasePlayerRow_CProps> {
        nativePtr: UE.ShooterCore.UserInterface.ScoreBoard.PlayerRow.W_BasePlayerRow.W_BasePlayerRow_C;
    }

    interface W_SB_PlayerIcon_CProps extends UserWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
    }

    class W_SB_PlayerIcon_C extends React.Component<W_SB_PlayerIcon_CProps> {
        nativePtr: UE.ShooterCore.UserInterface.ScoreBoard.PlayerRow.W_SB_PlayerIcon.W_SB_PlayerIcon_C;
    }

    interface W_SB_PlayerName_CProps extends UserWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
    }

    class W_SB_PlayerName_C extends React.Component<W_SB_PlayerName_CProps> {
        nativePtr: UE.ShooterCore.UserInterface.ScoreBoard.PlayerRow.W_SB_PlayerName.W_SB_PlayerName_C;
    }

    interface W_SB_PlayerStat_CProps extends UserWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
        StatTag?: RecursivePartial<UE.GameplayTag>;
        StatWidth?: number;
    }

    class W_SB_PlayerStat_C extends React.Component<W_SB_PlayerStat_CProps> {
        nativePtr: UE.ShooterCore.UserInterface.ScoreBoard.PlayerRow.W_SB_PlayerStat.W_SB_PlayerStat_C;
    }

    interface W_SB_PlayerList_CProps extends CommonActivatableWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
        TeamIdFilter?: number;
    }

    class W_SB_PlayerList_C extends React.Component<W_SB_PlayerList_CProps> {
        nativePtr: UE.ShooterCore.UserInterface.ScoreBoard.W_SB_PlayerList.W_SB_PlayerList_C;
    }

    interface W_SB_TeamStat_CProps extends UserWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
        TeamId?: number;
        StatId?: RecursivePartial<UE.GameplayTag>;
        IsTDMScoring?: boolean;
    }

    class W_SB_TeamStat_C extends React.Component<W_SB_TeamStat_CProps> {
        nativePtr: UE.ShooterCore.UserInterface.ScoreBoard.W_SB_TeamStat.W_SB_TeamStat_C;
    }

    interface W_UserConnectionStatus_CProps extends UserWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
    }

    class W_UserConnectionStatus_C extends React.Component<W_UserConnectionStatus_CProps> {
        nativePtr: UE.ShooterCore.UserInterface.ScoreBoard.W_UserConnectionStatus.W_UserConnectionStatus_C;
    }

    interface W_Replay_PlayerSelector_CProps extends UserWidgetProps {
    }

    class W_Replay_PlayerSelector_C extends React.Component<W_Replay_PlayerSelector_CProps> {
        nativePtr: UE.ShooterCore.UserInterface.Replays.W_Replay_PlayerSelector.W_Replay_PlayerSelector_C;
    }

    interface W_Replay_ScrubBar_CProps extends UserWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
    }

    class W_Replay_ScrubBar_C extends React.Component<W_Replay_ScrubBar_CProps> {
        nativePtr: UE.ShooterCore.UserInterface.Replays.W_Replay_ScrubBar.W_Replay_ScrubBar_C;
    }

    interface W_ShooterReplayHUD_CProps extends LyraHUDLayoutProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
    }

    class W_ShooterReplayHUD_C extends React.Component<W_ShooterReplayHUD_CProps> {
        nativePtr: UE.ShooterCore.UserInterface.Replays.W_ShooterReplayHUD.W_ShooterReplayHUD_C;
    }

    interface W_EliminationFeedEntryWidget_CProps extends UserWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
        AttackerTeamId?: number;
        AttackeeTeamId?: number;
    }

    class W_EliminationFeedEntryWidget_C extends React.Component<W_EliminationFeedEntryWidget_CProps> {
        nativePtr: UE.ShooterCore.UserInterface.Notifications.EliminationFeed.W_EliminationFeedEntryWidget.W_EliminationFeedEntryWidget_C;
    }

    interface W_EliminationFeed_CProps extends UserWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
    }

    class W_EliminationFeed_C extends React.Component<W_EliminationFeed_CProps> {
        nativePtr: UE.ShooterCore.UserInterface.Notifications.EliminationFeed.W_EliminationFeed.W_EliminationFeed_C;
    }

    interface W_AccoladeToast_CProps extends UserWidgetProps {
    }

    class W_AccoladeToast_C extends React.Component<W_AccoladeToast_CProps> {
        nativePtr: UE.ShooterCore.UserInterface.Notifications.Accolades.W_AccoladeToast.W_AccoladeToast_C;
    }

    interface W_AccoladeHostWidget_CProps extends LyraAccoladeHostWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
    }

    class W_AccoladeHostWidget_C extends React.Component<W_AccoladeHostWidget_CProps> {
        nativePtr: UE.ShooterCore.UserInterface.Notifications.Accolades.W_AccoladeHostWidget.W_AccoladeHostWidget_C;
    }

    interface W_AbilityFailureFeedback_CProps extends LyraTaggedWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
        FailureReasonText?: string;
    }

    class W_AbilityFailureFeedback_C extends React.Component<W_AbilityFailureFeedback_CProps> {
        nativePtr: UE.ShooterCore.UserInterface.HUD.W_AbilityFailureFeedback.W_AbilityFailureFeedback_C;
    }

    interface W_AbilityProgress_CProps extends LyraTaggedWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
        Duration?: number;
        StartTime?: number;
    }

    class W_AbilityProgress_C extends React.Component<W_AbilityProgress_CProps> {
        nativePtr: UE.ShooterCore.UserInterface.HUD.W_AbilityProgress.W_AbilityProgress_C;
    }

    interface W_DebugWeaponSpreadWidget_CProps extends LyraReticleWidgetBaseProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
    }

    class W_DebugWeaponSpreadWidget_C extends React.Component<W_DebugWeaponSpreadWidget_CProps> {
        nativePtr: UE.ShooterCore.UserInterface.HUD.W_DebugWeaponSpreadWidget.W_DebugWeaponSpreadWidget_C;
    }

    interface W_WeaponAmmoAndName_CProps extends LyraTaggedWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
    }

    class W_WeaponAmmoAndName_C extends React.Component<W_WeaponAmmoAndName_CProps> {
        nativePtr: UE.ShooterCore.UserInterface.HUD.W_WeaponAmmoAndName.W_WeaponAmmoAndName_C;
    }

    interface W_QuickBarSlot_CProps extends LyraTaggedWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
        SlotIndex?: number;
        IsEmpty?: boolean;
        IsSelected?: boolean;
    }

    class W_QuickBarSlot_C extends React.Component<W_QuickBarSlot_CProps> {
        nativePtr: UE.ShooterCore.UserInterface.HUD.W_QuickBarSlot.W_QuickBarSlot_C;
    }

    interface W_QuickBar_CProps extends LyraTaggedWidgetProps {
    }

    class W_QuickBar_C extends React.Component<W_QuickBar_CProps> {
        nativePtr: UE.ShooterCore.UserInterface.HUD.W_QuickBar.W_QuickBar_C;
    }

    interface W_Reticle_AmmoBar_CProps extends LyraReticleWidgetBaseProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
    }

    class W_Reticle_AmmoBar_C extends React.Component<W_Reticle_AmmoBar_CProps> {
        nativePtr: UE.ShooterCore.UserInterface.HUD.W_Reticle_AmmoBar.W_Reticle_AmmoBar_C;
    }

    interface W_Temp_ReticleDot_CProps extends LyraReticleWidgetBaseProps {
    }

    class W_Temp_ReticleDot_C extends React.Component<W_Temp_ReticleDot_CProps> {
        nativePtr: UE.ShooterCore.UserInterface.HUD.W_Temp_ReticleDot.W_Temp_ReticleDot_C;
    }

    interface W_WeaponReticleHost_CProps extends LyraWeaponUserInterfaceProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
    }

    class W_WeaponReticleHost_C extends React.Component<W_WeaponReticleHost_CProps> {
        nativePtr: UE.ShooterCore.UserInterface.HUD.W_WeaponReticleHost.W_WeaponReticleHost_C;
    }

    interface W_FireButton_CProps extends UserWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
    }

    class W_FireButton_C extends React.Component<W_FireButton_CProps> {
        nativePtr: UE.ShooterCore.UserInterface.W_FireButton.W_FireButton_C;
    }

    interface W_CrouchTouchButton_CProps extends UserWidgetProps {
    }

    class W_CrouchTouchButton_C extends React.Component<W_CrouchTouchButton_CProps> {
        nativePtr: UE.Game.Characters.Heroes.Abilities.W_CrouchTouchButton.W_CrouchTouchButton_C;
    }

    interface W_ProgressSpinner_CProps extends UserWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
        Size?: RecursivePartial<UE.Vector2D>;
    }

    class W_ProgressSpinner_C extends React.Component<W_ProgressSpinner_CProps> {
        nativePtr: UE.Game.UI.Foundation.Widgets.W_ProgressSpinner.W_ProgressSpinner_C;
    }

    interface W_Healthbar_CProps extends UserWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
        NormalizedHealth?: number;
        HealthOldValue?: number;
        HealthNewValue?: number;
    }

    class W_Healthbar_C extends React.Component<W_Healthbar_CProps> {
        nativePtr: UE.Game.UI.Hud.W_Healthbar.W_Healthbar_C;
    }

    interface W_LyraMenuButton_CProps extends LyraButtonBaseProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
        TextLeftRightPadding?: number;
        HitTestPadding_X?: number;
        HitTestPadding_Y?: number;
        PressProgress?: number;
        Font?: RecursivePartial<UE.SlateFontInfo>;
        ButtonBorderBrush?: RecursivePartial<UE.SlateBrush>;
        IconBrush?: RecursivePartial<UE.SlateBrush>;
        TextCase?: UE.ETextTransformPolicy;
        FlipIconXDimension?: boolean;
        IsDisabled?: boolean;
        UseImageOverlays?: boolean;
        UseScaleChangeSpacers?: boolean;
        UseIconOverride?: boolean;
        InputHorzAlignment?: UE.EHorizontalAlignment;
        InputVertAlignment?: UE.EVerticalAlignment;
        InputPadding?: RecursivePartial<UE.Margin>;
    }

    class W_LyraMenuButton_C extends React.Component<W_LyraMenuButton_CProps> {
        nativePtr: UE.Game.UI.Menu.W_LyraMenuButton.W_LyraMenuButton_C;
    }

    interface W_LyraArrowButton_CProps extends W_LyraMenuButton_CProps {
    }

    class W_LyraArrowButton_C extends React.Component<W_LyraArrowButton_CProps> {
        nativePtr: UE.Game.UI.Menu.W_LyraArrowButton.W_LyraArrowButton_C;
    }

    interface W_OpenMenuTouchButton_CProps extends UserWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
        CooldownTimer?: RecursivePartial<UE.TimerHandle>;
        Duration?: number;
        StartTime?: number;
        Charging?: boolean;
        DurationMessageTag?: RecursivePartial<UE.GameplayTag>;
    }

    class W_OpenMenuTouchButton_C extends React.Component<W_OpenMenuTouchButton_CProps> {
        nativePtr: UE.Game.UI.Hud.W_OpenMenuTouchButton.W_OpenMenuTouchButton_C;
    }

    interface W_ControllerDisconnected_CProps extends LyraControllerDisconnectedScreenProps {
    }

    class W_ControllerDisconnected_C extends React.Component<W_ControllerDisconnected_CProps> {
        nativePtr: UE.Game.UI.Foundation.Dialogs.W_ControllerDisconnected.W_ControllerDisconnected_C;
    }

    interface W_ShooterHUDLayout_CProps extends LyraHUDLayoutProps {
    }

    class W_ShooterHUDLayout_C extends React.Component<W_ShooterHUDLayout_CProps> {
        nativePtr: UE.ShooterCore.UserInterface.W_ShooterHUDLayout.W_ShooterHUDLayout_C;
    }

    interface W_TouchRegion_Base_CProps extends LyraTouchRegionProps {
    }

    class W_TouchRegion_Base_C extends React.Component<W_TouchRegion_Base_CProps> {
        nativePtr: UE.Game.UI.Hud.W_TouchRegion_Base.W_TouchRegion_Base_C;
    }

    interface W_TouchRegion_Left_CProps extends W_TouchRegion_Base_CProps {
    }

    class W_TouchRegion_Left_C extends React.Component<W_TouchRegion_Left_CProps> {
        nativePtr: UE.ShooterCore.Input.W_TouchRegion_Left.W_TouchRegion_Left_C;
    }

    interface W_RespawnTimer_CProps extends UserWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
        CooldownTimer?: RecursivePartial<UE.TimerHandle>;
        Duration?: number;
        StartTime?: number;
        Respawning?: boolean;
    }

    class W_RespawnTimer_C extends React.Component<W_RespawnTimer_CProps> {
        nativePtr: UE.ShooterCore.Game.Respawn.W_RespawnTimer.W_RespawnTimer_C;
    }

    interface EUW_MaterialTool_CProps extends EditorUtilityWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
    }

    class EUW_MaterialTool_C extends React.Component<EUW_MaterialTool_CProps> {
        nativePtr: UE.LyraExtTool.EUW_MaterialTool.EUW_MaterialTool_C;
    }

    interface W_ScoreBoard_HeaderRow_EliminationMode_CProps extends UserWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
        TeamId?: number;
    }

    class W_ScoreBoard_HeaderRow_EliminationMode_C extends React.Component<W_ScoreBoard_HeaderRow_EliminationMode_CProps> {
        nativePtr: UE.ShooterCore.Elimination.UI.W_ScoreBoard_HeaderRow_EliminationMode.W_ScoreBoard_HeaderRow_EliminationMode_C;
    }

    interface W_SB_PlayerRow_TDM_CProps extends W_BasePlayerRow_CProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
        TeamId?: number;
    }

    class W_SB_PlayerRow_TDM_C extends React.Component<W_SB_PlayerRow_TDM_CProps> {
        nativePtr: UE.ShooterCore.Elimination.UI.W_SB_PlayerRow_TDM.W_SB_PlayerRow_TDM_C;
    }

    interface W_MatchScoreBoard_Elimination_CProps extends LyraActivatableWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
    }

    class W_MatchScoreBoard_Elimination_C extends React.Component<W_MatchScoreBoard_Elimination_CProps> {
        nativePtr: UE.ShooterCore.Elimination.UI.W_MatchScoreBoard_Elimination.W_MatchScoreBoard_Elimination_C;
    }

    interface W_ScoreWidget_Elimination_CProps extends LyraTaggedWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
        MyTeamID?: number;
        EnemyTeamID?: number;
        PreviousTime?: number;
        PreviousScoreLeft?: number;
    }

    class W_ScoreWidget_Elimination_C extends React.Component<W_ScoreWidget_Elimination_CProps> {
        nativePtr: UE.ShooterCore.Elimination.UI.W_ScoreWidget_Elimination.W_ScoreWidget_Elimination_C;
    }

    interface W_ControlPointMarker_CProps extends CommonUserWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
        PointLetterText?: string;
        PointOwnerTeamId?: number;
        NumberOfOverlayingTeams?: number;
        PreviousPointOwnerTeamId?: number;
    }

    class W_ControlPointMarker_C extends React.Component<W_ControlPointMarker_CProps> {
        nativePtr: UE.ShooterCore.ControlPoint.UI.W_ControlPointMarker.W_ControlPointMarker_C;
    }

    interface W_ControlPointStatusWidget_CProps extends LyraTaggedWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
        MyTeamID?: number;
    }

    class W_ControlPointStatusWidget_C extends React.Component<W_ControlPointStatusWidget_CProps> {
        nativePtr: UE.ShooterCore.ControlPoint.UI.W_ControlPointStatusWidget.W_ControlPointStatusWidget_C;
    }

    interface W_CPScoreWidget_CProps extends LyraTaggedWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
        MyTeamID?: number;
        EnemyTeamId?: number;
        PreviousScoreLeft?: number;
    }

    class W_CPScoreWidget_C extends React.Component<W_CPScoreWidget_CProps> {
        nativePtr: UE.ShooterCore.ControlPoint.UI.W_CPScoreWidget.W_CPScoreWidget_C;
    }

    interface W_SB_PlayerRow_CP_CProps extends W_BasePlayerRow_CProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
        TeamId?: number;
    }

    class W_SB_PlayerRow_CP_C extends React.Component<W_SB_PlayerRow_CP_CProps> {
        nativePtr: UE.ShooterCore.ControlPoint.UI.W_SB_PlayerRow_CP.W_SB_PlayerRow_CP_C;
    }

    interface W_ScoreBoard_HeaderRow_CP_CProps extends UserWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
        TeamId?: number;
    }

    class W_ScoreBoard_HeaderRow_CP_C extends React.Component<W_ScoreBoard_HeaderRow_CP_CProps> {
        nativePtr: UE.ShooterCore.ControlPoint.UI.W_ScoreBoard_HeaderRow_CP.W_ScoreBoard_HeaderRow_CP_C;
    }

    interface W_MatchScoreBoard_CP_CProps extends LyraActivatableWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
    }

    class W_MatchScoreBoard_CP_C extends React.Component<W_MatchScoreBoard_CP_CProps> {
        nativePtr: UE.ShooterCore.ControlPoint.UI.W_MatchScoreBoard_CP.W_MatchScoreBoard_CP_C;
    }

    interface W_Reticle_Shotgun_CProps extends LyraReticleWidgetBaseProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
        SpreadRadiusScaler?: number;
    }

    class W_Reticle_Shotgun_C extends React.Component<W_Reticle_Shotgun_CProps> {
        nativePtr: UE.ShooterCore.Weapons.Shotgun.W_Reticle_Shotgun.W_Reticle_Shotgun_C;
    }

    interface W_AmmoCounter_Shotgun_CProps extends LyraReticleWidgetBaseProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
    }

    class W_AmmoCounter_Shotgun_C extends React.Component<W_AmmoCounter_Shotgun_CProps> {
        nativePtr: UE.ShooterCore.Weapons.Shotgun.W_AmmoCounter_Shotgun.W_AmmoCounter_Shotgun_C;
    }

    interface StillRenderSetupAutomation_CProps extends EditorUtilityWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
        TargetPackagePath?: string;
        OverrideCameraSettings?: boolean;
        Filmback?: RecursivePartial<UE.CameraFilmbackSettings>;
        LensSettings?: RecursivePartial<UE.LensSettings>;
        ConstrainAspectRatio?: boolean;
        JobAutoName?: string;
        bUseUniqueAssetNames?: boolean;
        bAutomaticallyAddJobsToMovieQueue?: boolean;
        SequenceCreationPath?: string;
        TargetCamera?: string;
        Binding?: RecursivePartial<UE.MovieSceneBindingProxy>;
        SequenceLength?: number;
        bOverrideOutputFolder?: boolean;
        OutputFolder?: RecursivePartial<UE.DirectoryPath>;
        bOverrideMovieResolution?: boolean;
        MovieResolution?: RecursivePartial<UE.IntPoint>;
        bOverrideTileCount?: boolean;
        TileCount?: number;
        bOverrideSpatialSampleCount?: boolean;
        SpatialSampleCount?: number;
        bOverrideTemporalSampleCount?: boolean;
        TemporalSampleCount?: number;
        bUseMapAsOutputPrefix?: boolean;
    }

    class StillRenderSetupAutomation_C extends React.Component<StillRenderSetupAutomation_CProps> {
        nativePtr: UE.MovieRenderPipeline.Editor.Stills.StillRenderSetupAutomation.StillRenderSetupAutomation_C;
    }

    interface MovieRenderPipelineExampleEditorWidget_CProps extends EditorUtilityWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
        TargetPackagePath?: string;
        MovieResolution?: RecursivePartial<UE.IntPoint>;
        OutputFolder?: RecursivePartial<UE.DirectoryPath>;
        TileCount?: number;
        SpatialSampleCount?: number;
        TemporalSampleCount?: number;
    }

    class MovieRenderPipelineExampleEditorWidget_C extends React.Component<MovieRenderPipelineExampleEditorWidget_CProps> {
        nativePtr: UE.MovieRenderPipeline.Editor.MovieRenderPipelineExampleEditorWidget.MovieRenderPipelineExampleEditorWidget_C;
    }

    interface DefaultGraphBurnIn_CProps extends MovieGraphBurnInWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
        CurrentCameraIndex?: number;
        CurrentCameraName?: string;
    }

    class DefaultGraphBurnIn_C extends React.Component<DefaultGraphBurnIn_CProps> {
        nativePtr: UE.MovieRenderPipeline.Blueprints.Graph.DefaultGraphBurnIn.DefaultGraphBurnIn_C;
    }

    interface UI_MovieGraph_PreviewWindowBannerMessage_CProps extends UserWidgetProps {
    }

    class UI_MovieGraph_PreviewWindowBannerMessage_C extends React.Component<UI_MovieGraph_PreviewWindowBannerMessage_CProps> {
        nativePtr: UE.MovieRenderPipeline.Blueprints.Graph.UI_MovieGraph_PreviewWindowBannerMessage.UI_MovieGraph_PreviewWindowBannerMessage_C;
    }

    interface UI_MovieGraphImagePreview_CProps extends UserWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
    }

    class UI_MovieGraphImagePreview_C extends React.Component<UI_MovieGraphImagePreview_CProps> {
        nativePtr: UE.MovieRenderPipeline.Blueprints.Graph.UI_MovieGraphImagePreview.UI_MovieGraphImagePreview_C;
    }

    interface DefaultBurnIn_CProps extends MoviePipelineBurnInWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
    }

    class DefaultBurnIn_C extends React.Component<DefaultBurnIn_CProps> {
        nativePtr: UE.MovieRenderPipeline.Blueprints.DefaultBurnIn.DefaultBurnIn_C;
    }

    interface UI_MovieRenderPipelineInfoTableRow_CProps extends UserWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
        LeftColumnText?: string;
        RightColumnText?: string;
    }

    class UI_MovieRenderPipelineInfoTableRow_C extends React.Component<UI_MovieRenderPipelineInfoTableRow_CProps> {
        nativePtr: UE.MovieRenderPipeline.Blueprints.UI_MovieRenderPipelineInfoTableRow.UI_MovieRenderPipelineInfoTableRow_C;
    }

    interface UI_MovieGraphPipelineScreenOverlay_CProps extends MovieGraphRenderPreviewWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
        CreatedGridWidgets?: TMap<UE.MovieGraphRenderDataIdentifier, UE.MovieRenderPipeline.Blueprints.Graph.UI_MovieGraphImagePreview.UI_MovieGraphImagePreview_C>;
    }

    class UI_MovieGraphPipelineScreenOverlay_C extends React.Component<UI_MovieGraphPipelineScreenOverlay_CProps> {
        nativePtr: UE.MovieRenderPipeline.Blueprints.UI_MovieGraphPipelineScreenOverlay.UI_MovieGraphPipelineScreenOverlay_C;
    }

    interface UI_MovieRenderPipelineScreenOverlay_CProps extends MovieRenderDebugWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
    }

    class UI_MovieRenderPipelineScreenOverlay_C extends React.Component<UI_MovieRenderPipelineScreenOverlay_CProps> {
        nativePtr: UE.MovieRenderPipeline.Blueprints.UI_MovieRenderPipelineScreenOverlay.UI_MovieRenderPipelineScreenOverlay_C;
    }

    interface UI_MovieRenderPipelineScreenOverlayBlank_CProps extends MovieRenderDebugWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
    }

    class UI_MovieRenderPipelineScreenOverlayBlank_C extends React.Component<UI_MovieRenderPipelineScreenOverlayBlank_CProps> {
        nativePtr: UE.MovieRenderPipeline.Blueprints.UI_MovieRenderPipelineScreenOverlayBlank.UI_MovieRenderPipelineScreenOverlayBlank_C;
    }

    interface DefaultRecordingOverlay_CProps extends TakeRecorderOverlayWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
    }

    class DefaultRecordingOverlay_C extends React.Component<DefaultRecordingOverlay_CProps> {
        nativePtr: UE.Takes.UMG.DefaultRecordingOverlay.DefaultRecordingOverlay_C;
    }

    interface DefaultTakeBurnIn_CProps extends LevelSequenceBurnInProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
        BackgroundColor?: RecursivePartial<UE.LinearColor>;
        Date?: string;
        hh?: string;
        mm?: string;
        ss?: string;
        ff?: string;
        MasterFrame?: string;
        ShotFrame?: string;
        MasterName?: string;
        ShotName?: string;
        FocalLength?: string;
        FocusDistance?: string;
        Aperture?: string;
        SensorWidth?: string;
        SensorHeight?: string;
        SensorAspectRatio?: string;
        Translation?: RecursivePartial<UE.Vector>;
        Rotation?: RecursivePartial<UE.Rotator>;
        bCached?: boolean;
        EngineVersion?: string;
        SourceTimecode?: string;
        Slate?: string;
        TakeNumber?: string;
        Time?: string;
    }

    class DefaultTakeBurnIn_C extends React.Component<DefaultTakeBurnIn_CProps> {
        nativePtr: UE.Takes.Sequencer.DefaultTakeBurnIn.DefaultTakeBurnIn_C;
    }

    interface AudioKnobLarge_CProps extends UserWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
        Units?: string;
        ToolTip?: string;
        Label?: string;
        MaxIntegralDigits?: number;
        MaxFractionalDigits?: number;
        DisplayMin?: string;
        DisplayMax?: string;
        ControlValueNormalized?: number;
        ControlValueMin?: number;
        ControlValueMax?: number;
        OnControlValueChanged?: (NewValue: number) => void;
        ControlValue?: number;
    }

    class AudioKnobLarge_C extends React.Component<AudioKnobLarge_CProps> {
        nativePtr: UE.AudioWidgets.AudioKnobLarge.AudioKnobLarge.AudioKnobLarge_C;
    }

    interface SubmixEffectDelayPresetWidget_CProps extends UserWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
    }

    class SubmixEffectDelayPresetWidget_C extends React.Component<SubmixEffectDelayPresetWidget_CProps> {
        nativePtr: UE.AudioWidgets.SubmixEffects.SubmixEffectDelayPresetWidget.SubmixEffectDelayPresetWidget_C;
    }

    interface AudioTextBox_CProps extends UserWidgetProps {
        UnitText?: string;
    }

    class AudioTextBox_C extends React.Component<AudioTextBox_CProps> {
        nativePtr: UE.AudioWidgets.AudioTextBox.AudioTextBox.AudioTextBox_C;
    }

    interface AudioKnobSmall_CProps extends UserWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
        Units?: string;
        ToolTip?: string;
        Label?: string;
        MaxIntegralDigits?: number;
        MaxFractionalDigits?: number;
        DisplayMin?: string;
        DisplayMax?: string;
        ControlValueNormalized?: number;
        ControlValueMin?: number;
        ControlValueMax?: number;
        OnControlValueChanged?: (NewValue: number) => void;
        ControlValue?: number;
    }

    class AudioKnobSmall_C extends React.Component<AudioKnobSmall_CProps> {
        nativePtr: UE.AudioWidgets.AudioKnobSmall.AudioKnobSmall.AudioKnobSmall_C;
    }

    interface AudioFader_CProps extends UserWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
        MinimumIntegralDigits?: number;
        MaximumIntegralDigits?: number;
        MinimumFractionalDigits?: number;
        MaximumFractionalDigits?: number;
        OnValueChanged?: (NewValue: number) => void;
    }

    class AudioFader_C extends React.Component<AudioFader_CProps> {
        nativePtr: UE.AudioWidgets.AudioFader.AudioFader.AudioFader_C;
    }

    interface AudioButtonToggle_CProps extends UserWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
        TextValue?: string;
        TextColor?: RecursivePartial<UE.SlateColor>;
        TextColorSelected?: RecursivePartial<UE.SlateColor>;
        BackgroundColor?: RecursivePartial<UE.LinearColor>;
        BackgroundColorSelected?: RecursivePartial<UE.LinearColor>;
        CurveTopLeft?: boolean;
        CurveTopRight?: boolean;
        CurveBottomLeft?: boolean;
        CurveBottomRight?: boolean;
        Selected?: boolean;
    }

    class AudioButtonToggle_C extends React.Component<AudioButtonToggle_CProps> {
        nativePtr: UE.AudioWidgets.AudioButtonToggle.AudioButtonToggle.AudioButtonToggle_C;
    }

    interface AudioButtonMatrixColumn_CProps extends UserWidgetProps {
    }

    class AudioButtonMatrixColumn_C extends React.Component<AudioButtonMatrixColumn_CProps> {
        nativePtr: UE.AudioWidgets.AudioButtonMatrix.AudioButtonMatrixColumn.AudioButtonMatrixColumn_C;
    }

    interface AudioButtonMatrix_CProps extends UserWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
        DisplayName?: string;
        Tooltip?: string;
        Values?: TArray<string>;
        NumColumns?: number;
        ExclusiveSelection?: boolean;
        OnMultiSelectionChanged?: (SelectedButtons: $Ref<TArray<UE.AudioWidgets.AudioButtonToggle.AudioButtonToggle.AudioButtonToggle_C>>) => void;
    }

    class AudioButtonMatrix_C extends React.Component<AudioButtonMatrix_CProps> {
        nativePtr: UE.AudioWidgets.AudioButtonMatrix.AudioButtonMatrix.AudioButtonMatrix_C;
    }

    interface UI_Button_CProps extends UserWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
        Text?: string;
    }

    class UI_Button_C extends React.Component<UI_Button_CProps> {
        nativePtr: UE.Volumetrics.Tools.CloudCompositing.Blueprints.GameSetup.UI.UI_Button.UI_Button_C;
    }

    interface UI_SingleButton_CProps extends UserWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
        Text?: string;
        OnClicked?: () => void;
    }

    class UI_SingleButton_C extends React.Component<UI_SingleButton_CProps> {
        nativePtr: UE.Volumetrics.Tools.CloudCompositing.Blueprints.GameSetup.UI.UI_SingleButton.UI_SingleButton_C;
    }

    interface UI_VolumetricPainting_Toolbar_CProps extends UserWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
        PaintBlendMode?: UE.Volumetrics.Tools.CloudCompositing.Blueprints.Enums.CloudPaintBlendMode.CloudPaintBlendMode;
        SelectedPaintingChannel?: number;
        GridOn?: boolean;
        FogOn?: boolean;
    }

    class UI_VolumetricPainting_Toolbar_C extends React.Component<UI_VolumetricPainting_Toolbar_CProps> {
        nativePtr: UE.Volumetrics.Tools.CloudCompositing.Blueprints.GameSetup.UI.UI_VolumetricPainting_Toolbar.UI_VolumetricPainting_Toolbar_C;
    }

    interface LandmassBrush_EntryWidget_CProps extends UserWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
        ListItemClicked?: () => void;
        Selected?: boolean;
    }

    class LandmassBrush_EntryWidget_C extends React.Component<LandmassBrush_EntryWidget_CProps> {
        nativePtr: UE.Landmass.Landscape.BlueprintBrushes.Widgets.LandmassBrush_EntryWidget.LandmassBrush_EntryWidget_C;
    }

    interface EUW_ErosionKey_CProps extends EditorUtilityWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
        KeyName?: string;
        ErosionMode?: UE.Landmass.Landscape.ErosionBrush.BP.Enums.E_Landmass_CustomBrush_ErosionModes.E_Landmass_CustomBrush_ErosionModes;
        ParticleErosionSettings?: RecursivePartial<UE.Landmass.Landscape.ErosionBrush.BP.Structs.Landmass_Particle_Erosion_Settings.Landmass_Particle_Erosion_Settings>;
        Default_ButtonStyle?: RecursivePartial<UE.ButtonStyle>;
        Selected_ButtonStyle?: RecursivePartial<UE.ButtonStyle>;
        SlopeSmoothingSettings?: RecursivePartial<UE.Landmass.Landscape.ErosionBrush.BP.Structs.Landmass_SlopeSmoothing_Settings.Landmass_SlopeSmoothing_Settings>;
        WaterLevellingSettings?: RecursivePartial<UE.Landmass.Landscape.ErosionBrush.BP.Structs.Landmass_WaterLevelling_Settings.Landmass_WaterLevelling_Settings>;
        NoiseInjectionSettings?: RecursivePartial<UE.Landmass.Landscape.ErosionBrush.BP.Structs.Landmass_Erosion_NoiseInjection.Landmass_Erosion_NoiseInjection>;
        CustomMaterialPass?: RecursivePartial<UE.Landmass.Landscape.ErosionBrush.BP.Structs.Landmass_Erosion_CustomMaterial.Landmass_Erosion_CustomMaterial>;
        DataAsset?: boolean;
    }

    class EUW_ErosionKey_C extends React.Component<EUW_ErosionKey_CProps> {
        nativePtr: UE.Landmass.Landscape.ErosionBrush.BP.Widgets.EUW_ErosionKey.EUW_ErosionKey_C;
    }

    interface EUW_Landmass_Editor_CProps extends EditorUtilityWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
        Drawing_MouseDragging?: boolean;
        DrawingMode?: boolean;
        ClickAndDragMode?: boolean;
        ClickToAddMode?: boolean;
        Points?: TArray<UE.Vector>;
        Size?: number;
        SelectedBrushZ?: number;
        ExtentsMin?: RecursivePartial<UE.Vector2D>;
        ExtentsMax?: RecursivePartial<UE.Vector2D>;
    }

    class EUW_Landmass_Editor_C extends React.Component<EUW_Landmass_Editor_CProps> {
        nativePtr: UE.Landmass.Landscape.BlueprintBrushes.Widgets.EUW_Landmass_Editor.EUW_Landmass_Editor_C;
    }

    interface EUW_Landscape_Erosion_CProps extends EditorUtilityWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
        Simulating?: boolean;
        Paused?: boolean;
        CurTime?: number;
        MaxIterations?: number;
        CurrentIteration?: number;
        ErosionKeyDataStructs?: TArray<UE.Landmass.Landscape.ErosionBrush.BP.Structs.Landmass_Erosion_Keyframe.Landmass_Erosion_Keyframe>;
    }

    class EUW_Landscape_Erosion_C extends React.Component<EUW_Landscape_Erosion_CProps> {
        nativePtr: UE.Landmass.Landscape.ErosionBrush.BP.Widgets.EUW_Landscape_Erosion.EUW_Landscape_Erosion_C;
    }

    interface LandmassViewport_Widget_CProps extends EditorUtilityWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
        Dragging?: boolean;
        LeftMouseDown?: boolean;
        RightMouseDown?: boolean;
        L_Key_Pressed?: boolean;
        mouse_prev?: RecursivePartial<UE.Vector2D>;
        MouseWheelDelta?: number;
        ZoomSensitivity?: number;
        FloorMesh?: boolean;
        CurrentPivot?: RecursivePartial<UE.Vector>;
        CamearFocusPosition?: RecursivePartial<UE.Vector>;
        AltPressed?: boolean;
    }

    class LandmassViewport_Widget_C extends React.Component<LandmassViewport_Widget_CProps> {
        nativePtr: UE.Landmass.Landscape.BlueprintBrushes.Widgets.LandmassViewport_Widget.LandmassViewport_Widget_C;
    }

    interface EUW_PerformanceCameras_CProps extends EditorUtilityWidgetProps {
    }

    class EUW_PerformanceCameras_C extends React.Component<EUW_PerformanceCameras_CProps> {
        nativePtr: UE.AutomatedPerfTesting.Tools.PerformanceCameras.EUW_PerformanceCameras.EUW_PerformanceCameras_C;
    }

    interface AnimationSampleUI_CProps extends EditorUtilityWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
        ImportedSequencesHelpersNamesToObj?: TMap<string, UE.DatasmithContent.Blueprints.FBXImporter.Animation.ImportedSequencesHelper.ImportedSequencesHelper_C>;
    }

    class AnimationSampleUI_C extends React.Component<AnimationSampleUI_CProps> {
        nativePtr: UE.DatasmithContent.Blueprints.FBXImporter.UI.AnimationSampleUI.AnimationSampleUI_C;
    }

    interface Widget_AssemblyPreviewSave_CProps extends EditorUtilityWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
        DebugToScreen?: boolean;
        ActorTaggerFolderPath?: string;
        BiomePreviewsFolderPath?: string;
        PreviewLevelsFolderName?: string;
        UserPreviewFolderPath?: string;
        ReferenceLightingLevelPath?: string;
        PreviewLoaded?: boolean;
        DebugToLog?: boolean;
        ASMActorLimit?: number;
        ClutterSeed?: number;
        ClutterDensity?: number;
        PreviewASMInstanceLimit?: number;
        PreviewGridSpacing?: number;
        UseGPUMeshPreview?: boolean;
        PackagePath?: string;
        AssetName?: string;
        PreviewAssemblyAssetPath?: string;
        ShowPreviewButtonText?: string;
    }

    class Widget_AssemblyPreviewSave_C extends React.Component<Widget_AssemblyPreviewSave_CProps> {
        nativePtr: UE.PCG.Utilities.Assemblies.ActorTagger.Widgets.Widget_AssemblyPreviewSave.Widget_AssemblyPreviewSave_C;
    }

    interface Widget_InputBlank_CProps extends EditorUtilityWidgetProps {
        FormattedTag?: string;
    }

    class Widget_InputBlank_C extends React.Component<Widget_InputBlank_CProps> {
        nativePtr: UE.PCG.Utilities.Assemblies.ActorTagger.Widgets.Widget_InputBlank.Widget_InputBlank_C;
    }

    interface Widget_InputClassDefaultObject_CProps extends EditorUtilityWidgetProps {
        FormattedTag?: string;
    }

    class Widget_InputClassDefaultObject_C extends React.Component<Widget_InputClassDefaultObject_CProps> {
        nativePtr: UE.PCG.Utilities.Assemblies.ActorTagger.Widgets.Widget_InputClassDefaultObject.Widget_InputClassDefaultObject_C;
    }

    interface Widget_InputFloat_CProps extends EditorUtilityWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
        InputValue?: string;
    }

    class Widget_InputFloat_C extends React.Component<Widget_InputFloat_CProps> {
        nativePtr: UE.PCG.Utilities.Assemblies.ActorTagger.Widgets.Widget_InputFloat.Widget_InputFloat_C;
    }

    interface Widget_InputSoftObjectPath_CProps extends EditorUtilityWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
        OutputTag?: string;
        SoftObjectPath?: string;
    }

    class Widget_InputSoftObjectPath_C extends React.Component<Widget_InputSoftObjectPath_CProps> {
        nativePtr: UE.PCG.Utilities.Assemblies.ActorTagger.Widgets.Widget_InputSoftObjectPath.Widget_InputSoftObjectPath_C;
    }

    interface Widget_InputString_CProps extends EditorUtilityWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
    }

    class Widget_InputString_C extends React.Component<Widget_InputString_CProps> {
        nativePtr: UE.PCG.Utilities.Assemblies.ActorTagger.Widgets.Widget_InputString.Widget_InputString_C;
    }

    interface Widget_InputTemplate_CProps extends EditorUtilityWidgetProps {
    }

    class Widget_InputTemplate_C extends React.Component<Widget_InputTemplate_CProps> {
        nativePtr: UE.PCG.Utilities.Assemblies.ActorTagger.Widgets.Widget_InputTemplate.Widget_InputTemplate_C;
    }

    interface Widget_InputVector3_CProps extends EditorUtilityWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
    }

    class Widget_InputVector3_C extends React.Component<Widget_InputVector3_CProps> {
        nativePtr: UE.PCG.Utilities.Assemblies.ActorTagger.Widgets.Widget_InputVector3.Widget_InputVector3_C;
    }

    interface Widget_MultiClickButton_CProps extends UserWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
        MouseButtonState?: number;
        TagText?: string;
        ButtonText?: string;
        DebugOutput?: boolean;
        TagMask?: bigint;
        TriState?: boolean;
        PostTagFunction?: number;
        Exclusive?: TArray<string>;
        SubComponents?: TArray<string>;
    }

    class Widget_MultiClickButton_C extends React.Component<Widget_MultiClickButton_CProps> {
        nativePtr: UE.PCG.Utilities.Assemblies.ActorTagger.Widgets.Widget_MultiClickButton.Widget_MultiClickButton_C;
    }

    interface Widget_SearchReplaceActors_CProps extends EditorUtilityWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
        TempTagsArray?: TArray<string>;
        CopyPasteTags?: TArray<string>;
        DebugOutput?: boolean;
    }

    class Widget_SearchReplaceActors_C extends React.Component<Widget_SearchReplaceActors_CProps> {
        nativePtr: UE.PCG.Utilities.Assemblies.ActorTagger.Widgets.Widget_SearchReplaceActors.Widget_SearchReplaceActors_C;
    }

    interface Widget_Tagging_CProps extends EditorUtilityWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
        MouseButtonState?: number;
        CtrlPressed?: boolean;
        AltPressed?: boolean;
        SelectedActorTags?: TArray<string>;
        AddTagName?: string;
        ShiftPressed?: boolean;
        DebugOutput?: boolean;
        WidgetFolderPath?: string;
    }

    class Widget_Tagging_C extends React.Component<Widget_Tagging_CProps> {
        nativePtr: UE.PCG.Utilities.Assemblies.ActorTagger.Widgets.Widget_Tagging.Widget_Tagging_C;
    }

    interface ActorTagger_CProps extends EditorUtilityWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
        AddTagName?: string;
        RemoveTagName?: string;
        SelectTagName?: string;
        ViewModeLit?: boolean;
        DebugOutput?: boolean;
        CopyPasteTags?: TArray<string>;
        TempTagsArray?: TArray<string>;
        ActorCount?: number;
        LandscapeHitLocation?: RecursivePartial<UE.Vector>;
        LandscapeHitNormal?: RecursivePartial<UE.Vector>;
        ProjectionHit?: boolean;
        CtrlPressed?: boolean;
        AltPressed?: boolean;
        LightingLevelLoaded?: boolean;
        PreviewLevelsFolderName?: string;
        ActorTaggerFolderPath?: string;
        BiomePreviewsFolderPath?: string;
        ReferenceLightingLevelPath?: string;
        ShiftPressed?: boolean;
        ReferenceLightingButtonText?: string;
    }

    class ActorTagger_C extends React.Component<ActorTagger_CProps> {
        nativePtr: UE.PCG.Utilities.Assemblies.ActorTagger.ActorTagger.ActorTagger_C;
    }

    interface DefaultBurnIn_CProps extends LevelSequenceBurnInProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
        BackgroundColor?: RecursivePartial<UE.LinearColor>;
        Date?: string;
        hh?: string;
        mm?: string;
        ss?: string;
        ff?: string;
        RootFrame?: string;
        ShotFrame?: string;
        RootName?: string;
        ShotName?: string;
        FocalLength?: string;
        FocusDistance?: string;
        Aperture?: string;
        SensorWidth?: string;
        SensorHeight?: string;
        SensorAspectRatio?: string;
        Translation?: RecursivePartial<UE.Vector>;
        Rotation?: RecursivePartial<UE.Rotator>;
        bCached?: boolean;
        EngineVersion?: string;
        SourceTimecode?: string;
    }

    class DefaultBurnIn_C extends React.Component<DefaultBurnIn_CProps> {
        nativePtr: UE.Engine.Sequencer.DefaultBurnIn.DefaultBurnIn_C;
    }

    interface W_LyraMenuButton_Modal_CProps extends W_LyraMenuButton_CProps {
    }

    class W_LyraMenuButton_Modal_C extends React.Component<W_LyraMenuButton_Modal_CProps> {
        nativePtr: UE.Game.UI.Menu.W_LyraMenuButton_Modal.W_LyraMenuButton_Modal_C;
    }

    interface W_SafeZoneEditor_CProps extends LyraSafeZoneEditorProps {
    }

    class W_SafeZoneEditor_C extends React.Component<W_SafeZoneEditor_CProps> {
        nativePtr: UE.Game.UI.Settings.Screens.SafeZone.W_SafeZoneEditor.W_SafeZoneEditor_C;
    }

    interface W_HDRCalibrationEditor_CProps extends LyraHDRCalibrationEditorProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
    }

    class W_HDRCalibrationEditor_C extends React.Component<W_HDRCalibrationEditor_CProps> {
        nativePtr: UE.Game.UI.Settings.Screens.HDRCalibration.W_HDRCalibrationEditor.W_HDRCalibrationEditor_C;
    }

    interface W_GammaEditor_CProps extends LyraActivatableWidgetProps {
    }

    class W_GammaEditor_C extends React.Component<W_GammaEditor_CProps> {
        nativePtr: UE.Game.UI.Settings.Screens.Gamma.W_GammaEditor.W_GammaEditor_C;
    }

    interface W_KeyAlreadyBoundWarning_CProps extends KeyAlreadyBoundWarningProps {
    }

    class W_KeyAlreadyBoundWarning_C extends React.Component<W_KeyAlreadyBoundWarning_CProps> {
        nativePtr: UE.Game.UI.Settings.Screens.W_KeyAlreadyBoundWarning.W_KeyAlreadyBoundWarning_C;
    }

    interface W_PressAnyKey_CProps extends GameSettingPressAnyKeyProps {
    }

    class W_PressAnyKey_C extends React.Component<W_PressAnyKey_CProps> {
        nativePtr: UE.Game.UI.Settings.Screens.W_PressAnyKey.W_PressAnyKey_C;
    }

    interface W_Settings_SubtitlePreview_CProps extends GameSettingDetailExtensionProps {
    }

    class W_Settings_SubtitlePreview_C extends React.Component<W_Settings_SubtitlePreview_CProps> {
        nativePtr: UE.Game.UI.Settings.Extensions.Subtitle.W_Settings_SubtitlePreview.W_Settings_SubtitlePreview_C;
    }

    interface W_EnumOptionDetailsEntry_CProps extends UserWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
        SelectedColor?: RecursivePartial<UE.SlateColor>;
        DefaultColor?: RecursivePartial<UE.SlateColor>;
    }

    class W_EnumOptionDetailsEntry_C extends React.Component<W_EnumOptionDetailsEntry_CProps> {
        nativePtr: UE.Game.UI.Settings.Extensions.Enum.W_EnumOptionDetailsEntry.W_EnumOptionDetailsEntry_C;
    }

    interface W_EnumOptionExtension_CProps extends GameSettingDetailExtensionProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
    }

    class W_EnumOptionExtension_C extends React.Component<W_EnumOptionExtension_CProps> {
        nativePtr: UE.Game.UI.Settings.Extensions.Enum.W_EnumOptionExtension.W_EnumOptionExtension_C;
    }

    interface W_ColorBlindExtension_CProps extends GameSettingDetailExtensionProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
    }

    class W_ColorBlindExtension_C extends React.Component<W_ColorBlindExtension_CProps> {
        nativePtr: UE.Game.UI.Settings.Extensions.ColorBlind.W_ColorBlindExtension.W_ColorBlindExtension_C;
    }

    interface W_SettingEntryBackground_CProps extends UserWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
        OnMouseEnterChanged?: (IsEnterEvent: boolean) => void;
    }

    class W_SettingEntryBackground_C extends React.Component<W_SettingEntryBackground_CProps> {
        nativePtr: UE.Game.UI.Settings.Editors.W_SettingEntryBackground.W_SettingEntryBackground_C;
    }

    interface W_SettingsListEntry_Action_CProps extends GameSettingListEntrySetting_ActionProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
    }

    class W_SettingsListEntry_Action_C extends React.Component<W_SettingsListEntry_Action_CProps> {
        nativePtr: UE.Game.UI.Settings.Editors.W_SettingsListEntry_Action.W_SettingsListEntry_Action_C;
    }

    interface W_SettingsRotator_CProps extends GameSettingRotatorProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
    }

    class W_SettingsRotator_C extends React.Component<W_SettingsRotator_CProps> {
        nativePtr: UE.Game.UI.Settings.Editors.W_SettingsRotator.W_SettingsRotator_C;
    }

    interface W_SettingsListEntry_Discrete_CProps extends GameSettingListEntrySetting_DiscreteProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
    }

    class W_SettingsListEntry_Discrete_C extends React.Component<W_SettingsListEntry_Discrete_CProps> {
        nativePtr: UE.Game.UI.Settings.Editors.W_SettingsListEntry_Discrete.W_SettingsListEntry_Discrete_C;
    }

    interface W_SettingsListEntry_Header_CProps extends GameSettingListEntry_SettingProps {
    }

    class W_SettingsListEntry_Header_C extends React.Component<W_SettingsListEntry_Header_CProps> {
        nativePtr: UE.Game.UI.Settings.Editors.W_SettingsListEntry_Header.W_SettingsListEntry_Header_C;
    }

    interface W_SettingsListEntry_KBMBinding_CProps extends LyraSettingsListEntrySetting_KeyboardInputProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
    }

    class W_SettingsListEntry_KBMBinding_C extends React.Component<W_SettingsListEntry_KBMBinding_CProps> {
        nativePtr: UE.Game.UI.Settings.Editors.W_SettingsListEntry_KBMBinding.W_SettingsListEntry_KBMBinding_C;
    }

    interface W_SettingsListEntry_Missing_CProps extends GameSettingListEntry_SettingProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
    }

    class W_SettingsListEntry_Missing_C extends React.Component<W_SettingsListEntry_Missing_CProps> {
        nativePtr: UE.Game.UI.Settings.Editors.W_SettingsListEntry_Missing.W_SettingsListEntry_Missing_C;
    }

    interface W_SettingsListEntry_Scalar_CProps extends GameSettingListEntrySetting_ScalarProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
    }

    class W_SettingsListEntry_Scalar_C extends React.Component<W_SettingsListEntry_Scalar_CProps> {
        nativePtr: UE.Game.UI.Settings.Editors.W_SettingsListEntry_Scalar.W_SettingsListEntry_Scalar_C;
    }

    interface W_SettingsListEntry_SubCollection_CProps extends GameSettingListEntrySetting_NavigationProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
    }

    class W_SettingsListEntry_SubCollection_C extends React.Component<W_SettingsListEntry_SubCollection_CProps> {
        nativePtr: UE.Game.UI.Settings.Editors.W_SettingsListEntry_SubCollection.W_SettingsListEntry_SubCollection_C;
    }

    interface W_GameSettingsDetailView_CProps extends GameSettingDetailViewProps {
    }

    class W_GameSettingsDetailView_C extends React.Component<W_GameSettingsDetailView_CProps> {
        nativePtr: UE.Game.UI.Settings.W_GameSettingsDetailView.W_GameSettingsDetailView_C;
    }

    interface W_HorizontalTabList_CProps extends LyraTabListWidgetBaseProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
        TabButtonPadding?: RecursivePartial<UE.Margin>;
        UseButtonStyle?: boolean;
        MinTabWidth?: number;
        DebugTabCount?: number;
    }

    class W_HorizontalTabList_C extends React.Component<W_HorizontalTabList_CProps> {
        nativePtr: UE.Game.UI.Foundation.TabbedView.W_HorizontalTabList.W_HorizontalTabList_C;
    }

    interface W_SettingsPanel_CProps extends GameSettingPanelProps {
    }

    class W_SettingsPanel_C extends React.Component<W_SettingsPanel_CProps> {
        nativePtr: UE.Game.UI.Settings.W_SettingsPanel.W_SettingsPanel_C;
    }

    interface W_LyraButtonTab_CProps extends LyraTabButtonBaseProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
    }

    class W_LyraButtonTab_C extends React.Component<W_LyraButtonTab_CProps> {
        nativePtr: UE.Game.UI.Foundation.Buttons.W_LyraButtonTab.W_LyraButtonTab_C;
    }

    interface W_BoundActionButton_CProps extends LyraBoundActionButtonProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
        IsDisabled?: boolean;
    }

    class W_BoundActionButton_C extends React.Component<W_BoundActionButton_CProps> {
        nativePtr: UE.Game.UI.Foundation.Widgets.BottomBar.W_BoundActionButton.W_BoundActionButton_C;
    }

    interface W_BottomActionBar_CProps extends CommonUserWidgetProps {
    }

    class W_BottomActionBar_C extends React.Component<W_BottomActionBar_CProps> {
        nativePtr: UE.Game.UI.Foundation.Widgets.BottomBar.W_BottomActionBar.W_BottomActionBar_C;
    }

    interface W_LyraSettingScreen_CProps extends LyraSettingScreenProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
    }

    class W_LyraSettingScreen_C extends React.Component<W_LyraSettingScreen_CProps> {
        nativePtr: UE.Game.UI.Settings.W_LyraSettingScreen.W_LyraSettingScreen_C;
    }

    interface W_SingleTextStat_CProps extends LyraPerfStatWidgetBaseProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
        StatDisplayName?: string;
        StatValueFormat?: string;
        FractionalDigits?: number;
        ValuePaddingWidth?: number;
        ScaleFactor?: number;
    }

    class W_SingleTextStat_C extends React.Component<W_SingleTextStat_CProps> {
        nativePtr: UE.Game.UI.PerfStats.W_SingleTextStat.W_SingleTextStat_C;
    }

    interface W_PerfStatContainer_FrontEnd_CProps extends LyraPerfStatContainerBaseProps {
    }

    class W_PerfStatContainer_FrontEnd_C extends React.Component<W_PerfStatContainer_FrontEnd_CProps> {
        nativePtr: UE.Game.UI.PerfStats.W_PerfStatContainer_FrontEnd.W_PerfStatContainer_FrontEnd_C;
    }

    interface W_SingleGraphStat_CProps extends LyraPerfStatWidgetBaseProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
        StatDisplayName?: string;
        StatValueFormat?: string;
        FractionalDigits?: number;
        ScaleFactor?: number;
    }

    class W_SingleGraphStat_C extends React.Component<W_SingleGraphStat_CProps> {
        nativePtr: UE.Game.UI.PerfStats.W_SingleGraphStat.W_SingleGraphStat_C;
    }

    interface W_PerfStatContainer_GraphOnly_CProps extends LyraPerfStatContainerBaseProps {
    }

    class W_PerfStatContainer_GraphOnly_C extends React.Component<W_PerfStatContainer_GraphOnly_CProps> {
        nativePtr: UE.Game.UI.PerfStats.W_PerfStatContainer_GraphOnly.W_PerfStatContainer_GraphOnly_C;
    }

    interface W_PerfStatContainer_TextOnly_CProps extends LyraPerfStatContainerBaseProps {
    }

    class W_PerfStatContainer_TextOnly_C extends React.Component<W_PerfStatContainer_TextOnly_CProps> {
        nativePtr: UE.Game.UI.PerfStats.W_PerfStatContainer_TextOnly.W_PerfStatContainer_TextOnly_C;
    }

    interface W_PerfStatGraph_CProps extends LyraPerfStatGraphProps {
    }

    class W_PerfStatGraph_C extends React.Component<W_PerfStatGraph_CProps> {
        nativePtr: UE.Game.UI.PerfStats.W_PerfStatGraph.W_PerfStatGraph_C;
    }

    interface W_LyraButton_CProps extends LyraButtonBaseProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
        ContentAlignment?: UE.EHorizontalAlignment;
        TextJustification?: UE.ETextJustify;
        TextTransformPolicy?: UE.ETextTransformPolicy;
        PressProgress?: number;
    }

    class W_LyraButton_C extends React.Component<W_LyraButton_CProps> {
        nativePtr: UE.Game.UI.Foundation.Buttons.W_LyraButton.W_LyraButton_C;
    }

    interface W_ReplayListEntry_CProps extends UserWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
    }

    class W_ReplayListEntry_C extends React.Component<W_ReplayListEntry_CProps> {
        nativePtr: UE.Game.UI.Menu.Replays.W_ReplayListEntry.W_ReplayListEntry_C;
    }

    interface W_ReplayBrowserScreen_CProps extends CommonActivatableWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
    }

    class W_ReplayBrowserScreen_C extends React.Component<W_ReplayBrowserScreen_CProps> {
        nativePtr: UE.Game.UI.Menu.Replays.W_ReplayBrowserScreen.W_ReplayBrowserScreen_C;
    }

    interface W_ExperienceList_CProps extends UserWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
        OnExperiencesLoaded?: () => void;
        ShowAllExperiences?: boolean;
    }

    class W_ExperienceList_C extends React.Component<W_ExperienceList_CProps> {
        nativePtr: UE.Game.UI.Menu.Experiences.W_ExperienceList.W_ExperienceList_C;
    }

    interface W_LyraTileButton_CProps extends LyraButtonBaseProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
        PressProgress?: number;
        Text?: string;
        IsDisabled?: boolean;
        Description?: string;
    }

    class W_LyraTileButton_C extends React.Component<W_LyraTileButton_CProps> {
        nativePtr: UE.Game.UI.Menu.W_LyraTileButton.W_LyraTileButton_C;
    }

    interface W_ExperienceSelectionScreen_CProps extends LyraActivatableWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
        OnlineMode?: UE.ECommonSessionOnlineMode;
    }

    class W_ExperienceSelectionScreen_C extends React.Component<W_ExperienceSelectionScreen_CProps> {
        nativePtr: UE.Game.UI.Menu.Experiences.W_ExperienceSelectionScreen.W_ExperienceSelectionScreen_C;
    }

    interface W_HostSessionScreen_CProps extends LyraActivatableWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
        OnlineMode?: UE.ECommonSessionOnlineMode;
        BotsEnabled?: boolean;
    }

    class W_HostSessionScreen_C extends React.Component<W_HostSessionScreen_CProps> {
        nativePtr: UE.Game.UI.Menu.Experiences.W_HostSessionScreen.W_HostSessionScreen_C;
    }

    interface W_LyraSessionButton_CProps extends LyraButtonBaseProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
        IsDisabled?: boolean;
    }

    class W_LyraSessionButton_C extends React.Component<W_LyraSessionButton_CProps> {
        nativePtr: UE.Game.UI.Menu.Experiences.W_LyraSessionButton.W_LyraSessionButton_C;
    }

    interface W_NonInteractiveSpinner_CProps extends LyraActivatableWidgetProps {
    }

    class W_NonInteractiveSpinner_C extends React.Component<W_NonInteractiveSpinner_CProps> {
        nativePtr: UE.Game.UI.Menu.Experiences.W_NonInteractiveSpinner.W_NonInteractiveSpinner_C;
    }

    interface W_SessionBrowserEntry_CProps extends CommonTabListWidgetBaseProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
    }

    class W_SessionBrowserEntry_C extends React.Component<W_SessionBrowserEntry_CProps> {
        nativePtr: UE.Game.UI.Menu.Experiences.W_SessionBrowserEntry.W_SessionBrowserEntry_C;
    }

    interface W_SessionBrowserScreen_CProps extends LyraActivatableWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
    }

    class W_SessionBrowserScreen_C extends React.Component<W_SessionBrowserScreen_CProps> {
        nativePtr: UE.Game.UI.Menu.Experiences.W_SessionBrowserScreen.W_SessionBrowserScreen_C;
    }

    interface W_BuildConfiguration_CProps extends CommonUserWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
    }

    class W_BuildConfiguration_C extends React.Component<W_BuildConfiguration_CProps> {
        nativePtr: UE.Game.UI.Menu.W_BuildConfiguration.W_BuildConfiguration_C;
    }

    interface W_FrontEndHUDLayout_CProps extends LyraHUDLayoutProps {
    }

    class W_FrontEndHUDLayout_C extends React.Component<W_FrontEndHUDLayout_CProps> {
        nativePtr: UE.Game.UI.FrontEnd.W_FrontEndHUDLayout.W_FrontEndHUDLayout_C;
    }

    interface W_UserWatermark_CProps extends UserWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
        PlayerNumber?: number;
        PlayerStatusText?: string;
    }

    class W_UserWatermark_C extends React.Component<W_UserWatermark_CProps> {
        nativePtr: UE.Game.UI.Menu.W_UserWatermark.W_UserWatermark_C;
    }

    interface W_UserLoginButton_CProps extends UserWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
        PlayerNumber?: number;
        PlayerStatusText?: string;
        WaitingForLoginInput?: boolean;
    }

    class W_UserLoginButton_C extends React.Component<W_UserLoginButton_CProps> {
        nativePtr: UE.Game.UI.Menu.W_UserLoginButton.W_UserLoginButton_C;
    }

    interface W_LyraFrontEnd_CProps extends LyraActivatableWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
        bWaitingForLoginInput?: boolean;
        bWaitingForPlayerInitialize?: boolean;
    }

    class W_LyraFrontEnd_C extends React.Component<W_LyraFrontEnd_CProps> {
        nativePtr: UE.Game.UI.Menu.W_LyraFrontEnd.W_LyraFrontEnd_C;
    }

    interface W_LyraStartup_CProps extends LyraActivatableWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
        bWaitingForPlayerInitialize?: boolean;
        bWaitingForLoginInput?: boolean;
    }

    class W_LyraStartup_C extends React.Component<W_LyraStartup_CProps> {
        nativePtr: UE.Game.UI.Menu.W_LyraStartup.W_LyraStartup_C;
    }

    interface W_TouchCloseButton_CProps extends CommonUserWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
    }

    class W_TouchCloseButton_C extends React.Component<W_TouchCloseButton_CProps> {
        nativePtr: UE.Game.UI.Menu.W_TouchCloseButton.W_TouchCloseButton_C;
    }

    interface W_Nameplate_CProps extends UserWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
        TeamId?: number;
        NameText?: string;
        HideOwnerName?: boolean;
        ShowTeamNamesOnly?: boolean;
    }

    class W_Nameplate_C extends React.Component<W_Nameplate_CProps> {
        nativePtr: UE.Game.UI.Indicators.W_Nameplate.W_Nameplate_C;
    }

    interface W_DefaultHUDLayout_CProps extends LyraHUDLayoutProps {
    }

    class W_DefaultHUDLayout_C extends React.Component<W_DefaultHUDLayout_CProps> {
        nativePtr: UE.Game.UI.Hud.W_DefaultHUDLayout.W_DefaultHUDLayout_C;
    }

    interface W_LyraGameMenu_CProps extends LyraActivatableWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
        FrontEndExperienceReference?: RecursivePartial<UE.PrimaryAssetId>;
    }

    class W_LyraGameMenu_C extends React.Component<W_LyraGameMenu_CProps> {
        nativePtr: UE.Game.UI.Hud.W_LyraGameMenu.W_LyraGameMenu_C;
    }

    interface W_OnScreenJoystick_Right_CProps extends LyraJoystickWidgetProps {
    }

    class W_OnScreenJoystick_Right_C extends React.Component<W_OnScreenJoystick_Right_CProps> {
        nativePtr: UE.Game.UI.Hud.W_OnScreenJoystick_Right.W_OnScreenJoystick_Right_C;
    }

    interface W_OnScreenJoystick_Left_CProps extends W_OnScreenJoystick_Right_CProps {
    }

    class W_OnScreenJoystick_Left_C extends React.Component<W_OnScreenJoystick_Left_CProps> {
        nativePtr: UE.Game.UI.Hud.W_OnScreenJoystick_Left.W_OnScreenJoystick_Left_C;
    }

    interface W_TouchRegion_Right_CProps extends W_TouchRegion_Base_CProps {
    }

    class W_TouchRegion_Right_C extends React.Component<W_TouchRegion_Right_CProps> {
        nativePtr: UE.Game.UI.Hud.W_TouchRegion_Right.W_TouchRegion_Right_C;
    }

    interface W_SimpleProgressBar_CProps extends MaterialProgressBarProps {
    }

    class W_SimpleProgressBar_C extends React.Component<W_SimpleProgressBar_CProps> {
        nativePtr: UE.Game.UI.Foundation.Widgets.SimpleProgressBar.W_SimpleProgressBar.W_SimpleProgressBar_C;
    }

    interface W_LoadingScreenReasonDebugText_CProps extends UserWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
    }

    class W_LoadingScreenReasonDebugText_C extends React.Component<W_LoadingScreenReasonDebugText_CProps> {
        nativePtr: UE.Game.UI.Foundation.LoadingScreen.W_LoadingScreenReasonDebugText.W_LoadingScreenReasonDebugText_C;
    }

    interface W_LyraLogo_LoadingScreen_CProps extends UserWidgetProps {
    }

    class W_LyraLogo_LoadingScreen_C extends React.Component<W_LyraLogo_LoadingScreen_CProps> {
        nativePtr: UE.Game.UI.Foundation.LoadingScreen.W_LyraLogo_LoadingScreen.W_LyraLogo_LoadingScreen_C;
    }

    interface W_LoadingScreen_DefaultContent_CProps extends UserWidgetProps {
    }

    class W_LoadingScreen_DefaultContent_C extends React.Component<W_LoadingScreen_DefaultContent_CProps> {
        nativePtr: UE.Game.UI.Foundation.LoadingScreen.W_LoadingScreen_DefaultContent.W_LoadingScreen_DefaultContent_C;
    }

    interface W_LoadingScreen_Host_CProps extends UserWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
    }

    class W_LoadingScreen_Host_C extends React.Component<W_LoadingScreen_Host_CProps> {
        nativePtr: UE.Game.UI.Foundation.LoadingScreen.W_LoadingScreen_Host.W_LoadingScreen_Host_C;
    }

    interface W_LyraLogo_Small_CProps extends UserWidgetProps {
    }

    class W_LyraLogo_Small_C extends React.Component<W_LyraLogo_Small_CProps> {
        nativePtr: UE.Game.UI.Foundation.LoadingScreen.W_LyraLogo_Small.W_LyraLogo_Small_C;
    }

    interface W_ConfirmationDialog_CProps extends LyraConfirmationScreenProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
    }

    class W_ConfirmationDialog_C extends React.Component<W_ConfirmationDialog_CProps> {
        nativePtr: UE.Game.UI.Foundation.Dialogs.W_ConfirmationDialog.W_ConfirmationDialog_C;
    }

    interface W_ConfirmationDefault_CProps extends W_ConfirmationDialog_CProps {
    }

    class W_ConfirmationDefault_C extends React.Component<W_ConfirmationDefault_CProps> {
        nativePtr: UE.Game.UI.Foundation.Dialogs.W_ConfirmationDefault.W_ConfirmationDefault_C;
    }

    interface W_ConfirmationError_CProps extends W_ConfirmationDialog_CProps {
    }

    class W_ConfirmationError_C extends React.Component<W_ConfirmationError_CProps> {
        nativePtr: UE.Game.UI.Foundation.Dialogs.W_ConfirmationError.W_ConfirmationError_C;
    }

    interface W_TapToggleActionBar_CProps extends CommonUserWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
    }

    class W_TapToggleActionBar_C extends React.Component<W_TapToggleActionBar_CProps> {
        nativePtr: UE.Game.UI.Credits.W_TapToggleActionBar.W_TapToggleActionBar_C;
    }

    interface W_Credits_CProps extends LyraActivatableWidgetProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
        CurrentPosition?: number;
        ScrollSpeed?: number;
        EndPointOffset?: number;
        ScrollTimerHandle?: RecursivePartial<UE.TimerHandle>;
        StudioPeopleString?: string;
        StudioPeopleText?: string;
    }

    class W_Credits_C extends React.Component<W_Credits_CProps> {
        nativePtr: UE.Game.UI.Credits.W_Credits.W_Credits_C;
    }

    interface W_OverallUILayout_CProps extends PrimaryGameLayoutProps {
        UberGraphFrame?: RecursivePartial<UE.PointerToUberGraphFrame>;
    }

    class W_OverallUILayout_C extends React.Component<W_OverallUILayout_CProps> {
        nativePtr: UE.Game.UI.W_OverallUILayout.W_OverallUILayout_C;
    }


    interface Root {
        removeFromViewport() : void;
        getWidget(): any;
    }

    interface TReactUMG {
        render(element: React.ReactElement) : Root;
        init(world: any) : void;
    }

    var ReactUMG : TReactUMG;
}    
    