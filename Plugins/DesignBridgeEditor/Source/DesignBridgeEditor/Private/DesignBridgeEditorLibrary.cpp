#include "DesignBridgeEditorLibrary.h"
#include "AssetToolsModule.h"
#include "AssetCompilingManager.h"
#include "Blueprint/UserWidget.h"
#include "Blueprint/WidgetTree.h"
#include "Components/CanvasPanel.h"
#include "Components/CanvasPanelSlot.h"
#include "Components/Button.h"
#include "Components/ButtonSlot.h"
#include "Components/Image.h"
#include "Components/TextBlock.h"
#include "Dom/JsonObject.h"
#include "Editor.h"
#include "Engine/Font.h"
#include "Engine/FontFace.h"
#include "Factories/FontFactory.h"
#include "Engine/Texture2D.h"
#include "Engine/TextureRenderTarget2D.h"
#include "WidgetBlueprintFactory.h"
#include "HAL/FileManager.h"
#include "ImageUtils.h"
#include "Kismet2/KismetEditorUtilities.h"
#include "Misc/FileHelper.h"
#include "Misc/PackageName.h"
#include "Misc/Paths.h"
#include "RenderingThread.h"
#include "Serialization/JsonReader.h"
#include "Serialization/JsonSerializer.h"
#include "Slate/WidgetRenderer.h"
#include "Framework/Application/SlateApplication.h"
#include "Widgets/Layout/SScaleBox.h"
#include "Widgets/Layout/SBox.h"
#include "Widgets/SWindow.h"
#include "UObject/MetaData.h"
#include "UObject/SavePackage.h"
#include "WidgetBlueprint.h"

DEFINE_LOG_CATEGORY_STATIC(LogDesignBridge, Log, All);

namespace DesignBridge
{
using FObject = TSharedPtr<FJsonObject>;
static TWeakPtr<SWindow> PreviewWindow;
static TWeakObjectPtr<UUserWidget> PreviewWidget;
struct FRendererCleanup
{
    void operator()(FWidgetRenderer* Renderer) const { BeginCleanup(Renderer); }
};
static FString String(const FObject& O, const TCHAR* Key, const FString& Default = FString())
{
    FString Value; return O.IsValid() && O->TryGetStringField(Key, Value) ? Value : Default;
}
static double Number(const FObject& O, const TCHAR* Key, double Default = 0)
{
    double Value; return O.IsValid() && O->TryGetNumberField(Key, Value) ? Value : Default;
}
static FObject Object(const FObject& O, const TCHAR* Key)
{
    const FObject* Result = nullptr; return O.IsValid() && O->TryGetObjectField(Key, Result) ? *Result : nullptr;
}
static bool Boolean(const FObject& O, const TCHAR* Key)
{
    bool Value = false; return O.IsValid() && O->TryGetBoolField(Key, Value) && Value;
}
static FLinearColor Color(const FObject& O, const TCHAR* Key, FLinearColor Default = FLinearColor::Transparent)
{
    const TArray<TSharedPtr<FJsonValue>>* Values = nullptr;
    if (!O.IsValid() || !O->TryGetArrayField(Key, Values) || Values->Num() != 4) return Default;
    const auto Linear = [](double V) { return V <= .04045 ? V / 12.92 : FMath::Pow((V + .055) / 1.055, 2.4); };
    return FLinearColor(Linear((*Values)[0]->AsNumber()), Linear((*Values)[1]->AsNumber()), Linear((*Values)[2]->AsNumber()), (*Values)[3]->AsNumber());
}
static FSlateBrush Brush(const FObject& Node, const TMap<FString, FString>& Assets, const TCHAR* ImageField, bool& Valid)
{
    FSlateBrush Result;
    Result.TintColor = Color(Node, TEXT("fill"));
    Result.DrawAs = ESlateBrushDrawType::RoundedBox;
    const FObject Bounds = Object(Node, TEXT("bounds"));
    Result.ImageSize = FVector2D(Number(Bounds, TEXT("width")), Number(Bounds, TEXT("height")));
    Result.OutlineSettings.RoundingType = ESlateBrushRoundingType::FixedRadius;
    Result.OutlineSettings.CornerRadii = FVector4(0, 0, 0, 0);
    const TArray<TSharedPtr<FJsonValue>>* Radii = nullptr;
    if (Node->TryGetArrayField(TEXT("radii"), Radii) && Radii->Num() == 4)
        Result.OutlineSettings.CornerRadii = FVector4((*Radii)[0]->AsNumber(), (*Radii)[1]->AsNumber(), (*Radii)[2]->AsNumber(), (*Radii)[3]->AsNumber());
    if (const FObject Stroke = Object(Node, TEXT("stroke")))
    {
        Result.OutlineSettings.Color = Color(Stroke, TEXT("color"));
        Result.OutlineSettings.Width = Number(Stroke, TEXT("width"));
    }
    const FString AssetId = String(Node, ImageField);
    if (!AssetId.IsEmpty())
    {
        const FString* Asset = Assets.Find(AssetId);
        UTexture2D* Texture = Asset ? LoadObject<UTexture2D>(nullptr, **Asset) : nullptr;
        if (!Texture) { UE_LOG(LogDesignBridge, Error, TEXT("Missing texture %s"), *AssetId); Valid = false; }
        Result.SetResourceObject(Texture);
        Result.DrawAs = ESlateBrushDrawType::Image;
        Result.Mirroring = Boolean(Node, TEXT("mirrorX")) ? ESlateBrushMirrorType::Horizontal : ESlateBrushMirrorType::NoMirror;
        Result.TintColor = FLinearColor::White;
    }
    return Result;
}
static void Place(UCanvasPanel* Parent, UWidget* Child, const FObject& Bounds, int32 Z)
{
    UCanvasPanelSlot* Slot = Parent->AddChildToCanvas(Child);
    Slot->SetAnchors(FAnchors(0, 0));
    Slot->SetAlignment(FVector2D::ZeroVector);
    Slot->SetPosition(FVector2D(Number(Bounds, TEXT("x")), Number(Bounds, TEXT("y"))));
    Slot->SetSize(FVector2D(Number(Bounds, TEXT("width")), Number(Bounds, TEXT("height"))));
    Slot->SetAutoSize(false); Slot->SetZOrder(Z);
}
}

FString UDesignBridgeEditorLibrary::BuildWidgetBlueprint(const FString& RuntimeJsonFile, const FString& AssetPath)
{
    using namespace DesignBridge;
    if (!AssetPath.StartsWith(TEXT("/Game/DesignBridge/")) || !FPackageName::IsValidLongPackageName(AssetPath))
    { UE_LOG(LogDesignBridge, Error, TEXT("Output must be a package under /Game/DesignBridge")); return FString(); }
    FString Text;
    FObject Design;
    if (!FFileHelper::LoadFileToString(Text, *RuntimeJsonFile) || !FJsonSerializer::Deserialize(TJsonReaderFactory<>::Create(Text), Design) || !Design.IsValid() || Number(Design, TEXT("schemaVersion")) != 1)
    { UE_LOG(LogDesignBridge, Error, TEXT("Invalid DesignBridge runtime file")); return FString(); }
    const TArray<TSharedPtr<FJsonValue>>* Nodes = nullptr;
    const TArray<TSharedPtr<FJsonValue>>* Resources = nullptr;
    const TArray<TSharedPtr<FJsonValue>>* Diagnostics = nullptr;
    if (!Design->TryGetArrayField(TEXT("nodes"), Nodes) || !Design->TryGetArrayField(TEXT("assets"), Resources) || !Design->TryGetArrayField(TEXT("diagnostics"), Diagnostics) || Nodes->Num() < 1 || Nodes->Num() > 10000) return FString();
    for (const auto& D : *Diagnostics) if (String(D->AsObject(), TEXT("severity")) == TEXT("error")) { UE_LOG(LogDesignBridge, Error, TEXT("Package has blocking diagnostics")); return FString(); }
    TMap<FString, FString> Assets;
    for (const auto& A : *Resources) Assets.Add(String(A->AsObject(), TEXT("id")), String(A->AsObject(), TEXT("uePath")));
    const FString AssetName = FPackageName::GetLongPackageAssetName(AssetPath);
    const FString ObjectPath = AssetPath + TEXT(".") + AssetName;
    UWidgetBlueprint* Blueprint = LoadObject<UWidgetBlueprint>(nullptr, *ObjectPath, nullptr, LOAD_NoWarn);
    if (Blueprint && Blueprint->GetPackage()->GetMetaData().GetValue(Blueprint, TEXT("DesignBridgeId")) != String(Design, TEXT("id")))
    { UE_LOG(LogDesignBridge, Error, TEXT("Refusing to replace an asset not owned by this design")); return FString(); }
    if (!Blueprint)
    {
        UWidgetBlueprintFactory* Factory = NewObject<UWidgetBlueprintFactory>();
        Factory->ParentClass = UUserWidget::StaticClass();
        Blueprint = Cast<UWidgetBlueprint>(FModuleManager::LoadModuleChecked<FAssetToolsModule>(TEXT("AssetTools")).Get().CreateAsset(AssetName, FPackageName::GetLongPackagePath(AssetPath), UWidgetBlueprint::StaticClass(), Factory));
    }
    if (!Blueprint) return FString();
    // Generated assets are entirely owned by this tool. Hand-written logic belongs in a wrapper.
    UWidgetTree* Tree = NewObject<UWidgetTree>(Blueprint, NAME_None, RF_Transactional);
    TMap<FString, UCanvasPanel*> Parents;
    bool Valid = true;
    int32 RootCount = 0;
    for (int32 Index = 0; Index < Nodes->Num() && Valid; ++Index)
    {
        const FObject Node = (*Nodes)[Index]->AsObject();
        const FString Id = String(Node, TEXT("id"));
        const FString Type = String(Node, TEXT("type"));
        const FString ParentId = String(Node, TEXT("parentId"));
        const FString Name = String(Node, TEXT("widgetName"));
        const FObject Bounds = Object(Node, TEXT("bounds"));
        if (Name.IsEmpty() || !Bounds || Number(Bounds, TEXT("width")) <= 0 || Number(Bounds, TEXT("height")) <= 0) { Valid = false; break; }
        UWidget* Widget = nullptr;
        if (Type == TEXT("frame")) Widget = Tree->ConstructWidget<UCanvasPanel>(UCanvasPanel::StaticClass(), *Name);
        else if (Type == TEXT("shape") || Type == TEXT("image"))
        {
            UImage* Image = Tree->ConstructWidget<UImage>(UImage::StaticClass(), *Name);
            Image->SetBrush(Brush(Node, Assets, TEXT("assetId"), Valid)); Widget = Image;
        }
        else if (Type == TEXT("text"))
        {
            UTextBlock* Label = Tree->ConstructWidget<UTextBlock>(UTextBlock::StaticClass(), *Name);
            const FObject Data = Object(Node, TEXT("text"));
            FString FontPath = String(Data, TEXT("ueFont"));
            if (FontPath.IsEmpty()) FontPath = Assets.FindRef(String(Data, TEXT("fontAssetId")));
            UFont* Font = LoadObject<UFont>(nullptr, *FontPath);
            if (!Font) { UE_LOG(LogDesignBridge, Error, TEXT("Missing font %s"), *FontPath); Valid = false; break; }
            FSlateFontInfo Info = Label->GetFont(); Info.FontObject = Font; Info.TypefaceFontName = *String(Data, TEXT("fontStyle"), TEXT("Regular"));
            Info.Size = Number(Data, TEXT("size")) * .75;
            Info.LetterSpacing = FMath::RoundToInt(Number(Data, TEXT("letterSpacing")) / Number(Data, TEXT("size"), 16) * 1000);
            Label->SetFont(Info); Label->SetText(FText::FromString(String(Data, TEXT("content"))));
            Label->SetColorAndOpacity(Color(Data, TEXT("color"), FLinearColor::White));
            const FString Align = String(Data, TEXT("align"));
            Label->SetJustification(Align == TEXT("right") ? ETextJustify::Right : Align == TEXT("center") ? ETextJustify::Center : ETextJustify::Left);
            Label->SetAutoWrapText(Boolean(Data, TEXT("wrap")));
            Label->SetWrapTextAt(Boolean(Data, TEXT("wrap")) ? Number(Bounds, TEXT("width")) : 0);
            Widget = Label;
        }
        else if (Type == TEXT("button"))
        {
            UButton* Button = Tree->ConstructWidget<UButton>(UButton::StaticClass(), *Name);
            FButtonStyle Style = Button->GetStyle(); const FSlateBrush B = Brush(Node, Assets, TEXT("backgroundAssetId"), Valid);
            Style.SetNormal(B).SetHovered(B).SetPressed(B).SetDisabled(B).SetNormalPadding(FMargin(0)).SetPressedPadding(FMargin(0));
            Button->SetStyle(Style); Widget = Button;
        }
        else { UE_LOG(LogDesignBridge, Error, TEXT("Unsupported node type %s"), *Type); Valid = false; break; }
        Widget->bIsVariable = true;
        Widget->SetRenderOpacity(Number(Node, TEXT("opacity"), 1));
        Widget->SetClipping(Boolean(Node, TEXT("clip")) ? EWidgetClipping::ClipToBounds : EWidgetClipping::Inherit);
        Widget->SetVisibility(Type == TEXT("button") ? ESlateVisibility::Visible : Type == TEXT("frame") ? ESlateVisibility::SelfHitTestInvisible : ESlateVisibility::HitTestInvisible);
        if (ParentId.IsEmpty())
        {
            if (++RootCount != 1 || Type != TEXT("frame")) { Valid = false; break; }
            Tree->RootWidget = Widget;
        }
        else if (UCanvasPanel** Parent = Parents.Find(ParentId)) Place(*Parent, Widget, Bounds, Index + 1);
        else { UE_LOG(LogDesignBridge, Error, TEXT("Missing/invalid parent for %s"), *Id); Valid = false; break; }
        UCanvasPanel* Panel = Cast<UCanvasPanel>(Widget);
        if (UButton* Button = Cast<UButton>(Widget))
        {
            Panel = Tree->ConstructWidget<UCanvasPanel>(UCanvasPanel::StaticClass(), *(Name + TEXT("_Content")));
            UButtonSlot* Slot = Cast<UButtonSlot>(Button->AddChild(Panel)); Slot->SetPadding(FMargin(0));
            Slot->SetHorizontalAlignment(HAlign_Fill); Slot->SetVerticalAlignment(VAlign_Fill);
        }
        if (Panel)
        {
            Parents.Add(Id, Panel);
            if (Type == TEXT("frame") && (Node->HasField(TEXT("fill")) || Node->HasField(TEXT("stroke")) || Node->HasField(TEXT("backgroundAssetId"))))
            {
                UImage* Paint = Tree->ConstructWidget<UImage>(UImage::StaticClass(), *(Name + TEXT("_Paint")));
                Paint->SetBrush(Brush(Node, Assets, TEXT("backgroundAssetId"), Valid)); Paint->SetVisibility(ESlateVisibility::HitTestInvisible);
                FObject Local = Object(Node, TEXT("backgroundBounds"));
                if (!Local) { Local = MakeShared<FJsonObject>(); Local->SetNumberField(TEXT("width"), Number(Bounds, TEXT("width"))); Local->SetNumberField(TEXT("height"), Number(Bounds, TEXT("height"))); }
                Place(Panel, Paint, Local, 0);
            }
        }
    }
    if (!Valid || RootCount != 1) { UE_LOG(LogDesignBridge, Error, TEXT("Widget construction failed; asset was not saved")); return FString(); }
    Blueprint->Modify(); Blueprint->WidgetTree = Tree;
    Blueprint->bCanCallInitializedWithoutPlayerContext = true;
    const FObject Canvas = Object(Design, TEXT("canvas"));
    Blueprint->ThumbnailSizeMode = EThumbnailPreviewSizeMode::Custom;
    Blueprint->ThumbnailCustomSize = FVector2D(Number(Canvas, TEXT("width")), Number(Canvas, TEXT("height")));
    FKismetEditorUtilities::CompileBlueprint(Blueprint);
    if (Blueprint->Status == BS_Error) { UE_LOG(LogDesignBridge, Error, TEXT("Generated blueprint compilation failed")); return FString(); }
    UPackage* Package = Blueprint->GetPackage(); Package->GetMetaData().SetValue(Blueprint, TEXT("DesignBridgeId"), *String(Design, TEXT("id")));
    Package->MarkPackageDirty();
    const FString Filename = FPackageName::LongPackageNameToFilename(AssetPath, FPackageName::GetAssetPackageExtension());
    IFileManager::Get().MakeDirectory(*FPaths::GetPath(Filename), true);
    FSavePackageArgs SaveArgs; SaveArgs.TopLevelFlags = RF_Public | RF_Standalone; SaveArgs.SaveFlags = SAVE_NoError;
    if (!UPackage::SavePackage(Package, Blueprint, *Filename, SaveArgs)) return FString();
    UE_LOG(LogDesignBridge, Display, TEXT("Generated %s with %d source nodes"), *ObjectPath, Nodes->Num());
    return ObjectPath;
}

bool UDesignBridgeEditorLibrary::CaptureWidget(UUserWidget* Widget, const FString& PngFilename, int32 Width, int32 Height)
{
    if (!Widget || Width < 1 || Height < 1 || int64(Width) * Height > 64000000 || GUsingNullRHI || !FSlateApplication::IsInitialized()) return false;
    FAssetCompilingManager::Get().FinishAllCompilation();
    FlushRenderingCommands();
    Widget->ForceLayoutPrepass();
    // Exactly one linear-to-sRGB conversion, performed by the render target.
    // UE 5.8 CreateTargetFor plus shader gamma correction otherwise applies it twice.
    TUniquePtr<FWidgetRenderer, DesignBridge::FRendererCleanup> Renderer(new FWidgetRenderer(false, true));
    UTextureRenderTarget2D* Target = NewObject<UTextureRenderTarget2D>();
    Target->ClearColor = FLinearColor::Transparent;
    Target->InitCustomFormat(Width, Height, PF_B8G8R8A8, false);
    Target->UpdateResourceImmediate(true);
    Renderer->DrawWidget(Target, Widget->TakeWidget(), FVector2D(Width, Height), 0);
    FlushRenderingCommands();
    TArray<FColor> Pixels;
    FReadSurfaceDataFlags Flags; Flags.SetLinearToGamma(false);
    if (!Target->GameThread_GetRenderTargetResource()->ReadPixels(Pixels, Flags)) return false;
    TArray64<uint8> Png;
    FImageUtils::PNGCompressImageArray(Width, Height, Pixels, Png);
    IFileManager::Get().MakeDirectory(*FPaths::GetPath(PngFilename), true);
    return FFileHelper::SaveArrayToFile(Png, *PngFilename);
}

bool UDesignBridgeEditorLibrary::CaptureBlueprint(const FString& AssetPath, const FString& PngFilename, int32 Width, int32 Height)
{
    UWidgetBlueprint* Blueprint = LoadObject<UWidgetBlueprint>(nullptr, *AssetPath);
    if (!Blueprint || !Blueprint->GeneratedClass || !GEditor) return false;
    UWorld* World = GEditor->GetEditorWorldContext().World();
    UUserWidget* Widget = CreateWidget<UUserWidget>(World, TSubclassOf<UUserWidget>(Blueprint->GeneratedClass.Get()));
    return CaptureWidget(Widget, PngFilename, Width, Height);
}

FString UDesignBridgeEditorLibrary::InspectWidget(UUserWidget* Widget)
{
    TArray<TSharedPtr<FJsonValue>> Nodes;
    if (Widget && Widget->WidgetTree) Widget->WidgetTree->ForEachWidget([&Nodes](UWidget* Child)
    {
        auto Node = MakeShared<FJsonObject>(); Node->SetStringField(TEXT("name"), Child->GetName());
        Node->SetStringField(TEXT("class"), Child->GetClass()->GetName());
        if (const UImage* Image = Cast<UImage>(Child)) Node->SetStringField(TEXT("resource"), GetPathNameSafe(Image->GetBrush().GetResourceObject()));
        if (const UTextBlock* Label = Cast<UTextBlock>(Child)) Node->SetStringField(TEXT("text"), Label->GetText().ToString());
        if (const UCanvasPanelSlot* Slot = Cast<UCanvasPanelSlot>(Child->Slot))
        {
            Node->SetNumberField(TEXT("x"), Slot->GetPosition().X); Node->SetNumberField(TEXT("y"), Slot->GetPosition().Y);
            Node->SetNumberField(TEXT("width"), Slot->GetSize().X); Node->SetNumberField(TEXT("height"), Slot->GetSize().Y);
        }
        Nodes.Add(MakeShared<FJsonValueObject>(Node));
    });
    auto Result = MakeShared<FJsonObject>(); Result->SetArrayField(TEXT("widgets"), Nodes);
    FString Json; FJsonSerializer::Serialize(TSharedPtr<FJsonObject>(Result), TJsonWriterFactory<>::Create(&Json)); return Json;
}

UWorld* UDesignBridgeEditorLibrary::GetVerificationWorld()
{
    return GEditor ? GEditor->GetEditorWorldContext().World() : nullptr;
}

FString UDesignBridgeEditorLibrary::InspectBlueprint(const FString& AssetPath)
{
    UWidgetBlueprint* Blueprint = LoadObject<UWidgetBlueprint>(nullptr, *AssetPath);
    if (!Blueprint || !Blueprint->GeneratedClass) return FString();
    return InspectWidget(CreateWidget<UUserWidget>(GetVerificationWorld(), TSubclassOf<UUserWidget>(Blueprint->GeneratedClass.Get())));
}

bool UDesignBridgeEditorLibrary::TriggerButton(UUserWidget* Widget, const FString& ButtonName)
{
    if (!Widget || !Widget->WidgetTree) return false;
    UButton* Button = Cast<UButton>(Widget->WidgetTree->FindWidget(*ButtonName));
    if (!Button) return false;
    Button->OnClicked.Broadcast(); return true;
}

FString UDesignBridgeEditorLibrary::CreateFontAsset(UObject* FontFaceObject, const FString& AssetPath, const FString& TypefaceName)
{
    UFontFace* Face = Cast<UFontFace>(FontFaceObject);
    if (!Face || !AssetPath.StartsWith(TEXT("/Game/DesignBridge/")) || !FPackageName::IsValidLongPackageName(AssetPath)) return FString();
    const FString Name = FPackageName::GetLongPackageAssetName(AssetPath);
    const FString ObjectPath = AssetPath + TEXT(".") + Name;
    UFont* Font = LoadObject<UFont>(nullptr, *ObjectPath, nullptr, LOAD_NoWarn);
    if (Font && Font->GetPackage()->GetMetaData().GetValue(Font, TEXT("DesignBridgeFace")) != Face->GetPathName()) return FString();
    if (!Font) Font = Cast<UFont>(FModuleManager::LoadModuleChecked<FAssetToolsModule>(TEXT("AssetTools")).Get().CreateAsset(Name, FPackageName::GetLongPackagePath(AssetPath), UFont::StaticClass(), NewObject<UFontFactory>()));
    if (!Font) return FString();
    Font->FontCacheType = EFontCacheType::Runtime;
    FCompositeFont& Composite = Font->GetMutableInternalCompositeFont();
    Composite.DefaultTypeface.Fonts.Reset();
    FTypefaceEntry Entry(*TypefaceName); Entry.Font = FFontData(Face);
    Composite.DefaultTypeface.Fonts.Add(Entry);
    Font->PostEditChange();
    UPackage* Package = Font->GetPackage(); Package->GetMetaData().SetValue(Font, TEXT("DesignBridgeFace"), *Face->GetPathName()); Package->MarkPackageDirty();
    const FString Filename = FPackageName::LongPackageNameToFilename(AssetPath, FPackageName::GetAssetPackageExtension());
    IFileManager::Get().MakeDirectory(*FPaths::GetPath(Filename), true);
    FSavePackageArgs Args; Args.TopLevelFlags = RF_Public | RF_Standalone; Args.SaveFlags = SAVE_NoError;
    return UPackage::SavePackage(Package, Font, *Filename, Args) ? ObjectPath : FString();
}

bool UDesignBridgeEditorLibrary::ShowPreviewWindow(UUserWidget* Widget, const FString& Title, int32 DesignWidth, int32 DesignHeight)
{
    if (!Widget || !FSlateApplication::IsInitialized() || DesignWidth < 1 || DesignHeight < 1) return false;
    if (const TSharedPtr<SWindow> Existing = DesignBridge::PreviewWindow.Pin()) Existing->RequestDestroyWindow();
    const float Scale = FMath::Min(1.f, 1100.f / DesignWidth);
    TSharedRef<SWindow> Window = SNew(SWindow).Title(FText::FromString(Title))
        .ClientSize(FVector2D(DesignWidth * Scale, DesignHeight * Scale)).SupportsMaximize(true).SupportsMinimize(true)
        [ SNew(SScaleBox).Stretch(EStretch::ScaleToFit)
          [ SNew(SBox).WidthOverride(DesignWidth).HeightOverride(DesignHeight)[ Widget->TakeWidget() ] ] ];
    DesignBridge::PreviewWidget = Widget;
    DesignBridge::PreviewWindow = Window;
    FSlateApplication::Get().AddWindow(Window);
    return true;
}

void UDesignBridgeEditorLibrary::ClosePreviewWindow(UUserWidget* Widget)
{
    if (DesignBridge::PreviewWidget.Get() != Widget) return;
    if (const TSharedPtr<SWindow> Window = DesignBridge::PreviewWindow.Pin()) Window->RequestDestroyWindow();
    DesignBridge::PreviewWindow.Reset();
    DesignBridge::PreviewWidget.Reset();
}
