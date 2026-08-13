// Copyright Epic Games, Inc. All Rights Reserved.

#include "GameFeatures/LyraGameFeatureStatics.h"

#include "GameFeaturesSubsystem.h"

void ULyraGameFeatureStatics::ActivateGameFeature(const FString& PluginURL)
{
	// 空委托安全：子系统内部 ExecuteIfBound 检查是否绑定。
	UGameFeaturesSubsystem::Get().LoadAndActivateGameFeaturePlugin(PluginURL, FGameFeaturePluginLoadComplete());
}

void ULyraGameFeatureStatics::DeactivateGameFeature(const FString& PluginURL)
{
	// 单参重载，无需委托。
	UGameFeaturesSubsystem::Get().DeactivateGameFeaturePlugin(PluginURL);
}

bool ULyraGameFeatureStatics::IsGameFeatureActive(const FString& PluginURL)
{
	return UGameFeaturesSubsystem::Get().IsGameFeaturePluginActive(PluginURL);
}
