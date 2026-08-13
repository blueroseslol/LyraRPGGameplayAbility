// Copyright Epic Games, Inc. All Rights Reserved.

using UnrealBuildTool;

public class ShooterCoreRuntime : ModuleRules
{
	public ShooterCoreRuntime(ReadOnlyTargetRules Target) : base(Target)
	{
		PCHUsage = ModuleRules.PCHUsageMode.UseExplicitOrSharedPCHs;
		
		PublicIncludePaths.AddRange(
			new string[] {
				// ... add public include paths required here ...
			}
			);
				
		
		PrivateIncludePaths.AddRange(
			new string[] {
				// ... add other private include paths required here ...
			}
			);
			
		
		PublicDependencyModuleNames.AddRange(
			new string[]
			{
				"Core",
				"LyraGame",
				"ModularGameplay",
				"CommonGame",
				"GameplayTags",	// 公共头文件使用 FGameplayTag（Travel/LyraTravelDestination.h 等）
				"GameFeatures",	// 公共头文件使用 UGameFeatureAction/UGameFeatureData（GameFeatures/LyraGameFeatureStatics.h 等）
				// ... add other public dependencies that you statically link with here ...
			}
			);


		PrivateDependencyModuleNames.AddRange(
			new string[]
			{
				"CoreUObject",
				"Engine",
				"Slate",
				"SlateCore",
				"GameplayTasks",
				"GameplayAbilities",
				"GameplayMessageRuntime",
				"CommonUI",
				"UMG",
				"DataRegistry",
				"AsyncMixin",
				"EnhancedInput",
				"GameSubtitles",
				"DeveloperSettings",
				"AIModule"
				// ... add private dependencies that you statically link with here ...
			}
			);
		
		
		DynamicallyLoadedModuleNames.AddRange(
			new string[]
			{
				// ... add any modules that your module loads dynamically here ...
			}
			);
	}
}
