#pragma once
#include "CoreMinimal.h"
#include "UObject/Object.h"
#include "HarnessScriptResult.generated.h"

// Per-invocation completion object passed to Puerts; no global result state.
UCLASS()
class UHarnessScriptResult : public UObject
{
    GENERATED_BODY()
public:
    UPROPERTY()
    FString Case;
    UPROPERTY()
    FString Fault;
    UFUNCTION()
    void Complete(bool bSuccess, const FString& Message)
    {
        if (bComplete) return;
        bPassed = bSuccess;
        Error = Message;
        bComplete = true;
    }
    bool bComplete = false;
    bool bPassed = false;
    FString Error;
};
