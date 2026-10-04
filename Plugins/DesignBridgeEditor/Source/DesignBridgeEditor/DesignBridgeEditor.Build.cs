using UnrealBuildTool;
public class DesignBridgeEditor : ModuleRules
{
    public DesignBridgeEditor(ReadOnlyTargetRules Target) : base(Target)
    {
        PCHUsage = PCHUsageMode.UseExplicitOrSharedPCHs;
        PublicDependencyModuleNames.AddRange(new[] { "Core", "CoreUObject", "Engine", "UMG" });
        PrivateDependencyModuleNames.AddRange(new[] { "UnrealEd", "UMGEditor", "AssetTools", "Slate", "SlateCore", "Json", "RenderCore", "RHI" });
    }
}
