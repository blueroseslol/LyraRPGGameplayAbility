// Copyright Epic Games, Inc. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "Kismet/BlueprintFunctionLibrary.h"

#include "LyraGameFeatureStatics.generated.h"

/**
 * GameFeature 控制的 BlueprintCallable 薄包装（M5, 控制收口）。
 *
 * UGameFeaturesSubsystem 的激活/停用方法不是 UFUNCTION（见引擎
 * GameFeaturesSubsystem.h：LoadAndActivateGameFeaturePlugin 等均为 UE_API 纯 C++），
 * PuerTS / 蓝图无法直接调用。本类把它们包装成静态 BlueprintCallable 函数，
 * 供 TS 编排层 / 蓝图 / C++ 驱动：
 * 由调用方决定「何时激活哪个 GameFeature」，实际开关走 UE 原生子系统。
 */
UCLASS()
class ULyraGameFeatureStatics : public UBlueprintFunctionLibrary
{
	GENERATED_BODY()

public:
	/** 加载并激活一个内置 GameFeature 插件（按插件名，如 "ShooterCore"）。 */
	UFUNCTION(BlueprintCallable, Category = "GameFeatures")
	static void ActivateGameFeature(const FString& PluginURL);

	/** 停用一个 GameFeature 插件。 */
	UFUNCTION(BlueprintCallable, Category = "GameFeatures")
	static void DeactivateGameFeature(const FString& PluginURL);

	/** 查询某 GameFeature 插件是否已激活。 */
	UFUNCTION(BlueprintPure, Category = "GameFeatures")
	static bool IsGameFeatureActive(const FString& PluginURL);
};
