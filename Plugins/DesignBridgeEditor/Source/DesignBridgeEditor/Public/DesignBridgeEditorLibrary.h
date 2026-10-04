#pragma once
#include "CoreMinimal.h"
#include "Kismet/BlueprintFunctionLibrary.h"
#include "DesignBridgeEditorLibrary.generated.h"

class UUserWidget;

UCLASS()
class DESIGNBRIDGEEDITOR_API UDesignBridgeEditorLibrary : public UBlueprintFunctionLibrary
{
    GENERATED_BODY()
public:
    /** Reads a validated runtime.json; assets must already have been imported. Writes only /Game/DesignBridge. */
    UFUNCTION(BlueprintCallable, Category="DesignBridge|Editor")
    static FString BuildWidgetBlueprint(const FString& RuntimeJsonFile, const FString& AssetPath);

    /** Offscreen Slate capture at exact design resolution, with no viewport DPI scaling. */
    UFUNCTION(BlueprintCallable, Category="DesignBridge|Editor")
    static bool CaptureWidget(UUserWidget* Widget, const FString& PngFilename, int32 Width, int32 Height);

    UFUNCTION(BlueprintCallable, Category="DesignBridge|Editor")
    static bool CaptureBlueprint(const FString& AssetPath, const FString& PngFilename, int32 Width, int32 Height);

    UFUNCTION(BlueprintCallable, Category="DesignBridge|Editor")
    static FString InspectWidget(UUserWidget* Widget);

    UFUNCTION(BlueprintCallable, Category="DesignBridge|Editor")
    static FString InspectBlueprint(const FString& AssetPath);

    UFUNCTION(BlueprintCallable, Category="DesignBridge|Editor")
    static bool TriggerButton(UUserWidget* Widget, const FString& ButtonName);

    UFUNCTION(BlueprintCallable, Category="DesignBridge|Editor")
    static UWorld* GetVerificationWorld();

    UFUNCTION(BlueprintCallable, Category="DesignBridge|Editor")
    static FString CreateFontAsset(UObject* FontFaceObject, const FString& AssetPath, const FString& TypefaceName);

    /** Hosts an already-created runtime widget; does not load or create a Widget Blueprint. */
    UFUNCTION(BlueprintCallable, Category="DesignBridge|Editor")
    static bool ShowPreviewWindow(UUserWidget* Widget, const FString& Title, int32 DesignWidth, int32 DesignHeight);

    UFUNCTION(BlueprintCallable, Category="DesignBridge|Editor")
    static void ClosePreviewWindow(UUserWidget* Widget);
};
