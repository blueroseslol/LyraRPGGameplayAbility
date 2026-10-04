#include "Misc/AutomationTest.h"
#if WITH_DEV_AUTOMATION_TESTS
#include "HarnessScriptResult.h"
#include "JsEnv.h"
#include "Misc/CommandLine.h"
#include "Misc/Parse.h"
#include "UObject/StrongObjectPtr.h"

IMPLEMENT_COMPLEX_AUTOMATION_TEST(FHarnessLyraScript, "Harness.Puerts.Lyra",
    EAutomationTestFlags::EditorContext | EAutomationTestFlags::EngineFilter)

void FHarnessLyraScript::GetTests(TArray<FString>& Names, TArray<FString>& Commands) const
{
    Names.Add(TEXT("Inventory")); Commands.Add(TEXT("Inventory"));
    Names.Add(TEXT("AsyncInventory")); Commands.Add(TEXT("AsyncInventory"));
}

class FRunHarnessScript : public IAutomationLatentCommand
{
public:
    FRunHarnessScript(FAutomationTestBase* InTest, const FString& InCase)
        : Test(InTest), Result(NewObject<UHarnessScriptResult>())
    {
        Result->Case = InCase;
        for (const TCHAR* Fault : {TEXT("Throw"), TEXT("Reject"), TEXT("Timeout"), TEXT("Failure")})
            if (FParse::Param(FCommandLine::Get(), *(FString(TEXT("HarnessScript")) + Fault))) Result->Fault = Fault;
    }
    virtual bool Update() override
    {
        if (!Env)
        {
            Started = FPlatformTime::Seconds();
            Env = MakeUnique<puerts::FJsEnv>();
            Env->Start(TEXT("TypeScript/Harness/Run"), {{TEXT("Result"), Result.Get()}});
        }
        if (Result->bComplete)
        {
            if (!Result->bPassed) Test->AddError(Result->Error.IsEmpty() ? TEXT("TS test failed without a reason") : Result->Error);
            else Test->AddInfo(TEXT("Lyra TypeScript test completed successfully"));
            Env.Reset();
            return true;
        }
        if (FPlatformTime::Seconds() - Started > 5)
        {
            Test->AddError(TEXT("TypeScript test timed out without completion (5 seconds)"));
            Env.Reset();
            return true;
        }
        return false;
    }
private:
    FAutomationTestBase* Test;
    TStrongObjectPtr<UHarnessScriptResult> Result;
    TUniquePtr<puerts::FJsEnv> Env;
    double Started = 0;
};

bool FHarnessLyraScript::RunTest(const FString& Parameters)
{
    FAutomationTestFramework::Get().EnqueueLatentCommand(MakeShared<FRunHarnessScript>(this, Parameters));
    return true;
}
#endif
