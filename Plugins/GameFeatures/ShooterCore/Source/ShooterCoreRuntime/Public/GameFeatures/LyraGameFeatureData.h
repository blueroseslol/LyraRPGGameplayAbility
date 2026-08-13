// Copyright Epic Games, Inc. All Rights Reserved.

#pragma once

#include "GameFeatureData.h"

#include "LyraGameFeatureData.generated.h"

/**
 * ShooterCore 的 GameFeatureData（M5, 控制收口）。
 *
 * 在编辑器里创建本类的 DataAsset 实例（建议路径：
 * ShooterCore/Content/GameFeatureData/ShooterCore），并在 Actions 数组添加
 * UGameFeatureAction 子类等动作。插件激活时由 UGameFeaturesSubsystem
 * 扫描并执行其 Actions（经 Lyra Experience 的 GameFeaturesToEnable，或
 * ULyraGameFeatureStatics::ActivateGameFeature 驱动）。
 *
 * 说明：UGameFeatureData 本身是引擎类，本子类只为给 ShooterCore 一个具名、
 * 可发现的 PrimaryDataAsset 类型；若无需扩展，也可直接用引擎基类建资产。
 */
UCLASS()
class ULyraGameFeatureData : public UGameFeatureData
{
	GENERATED_BODY()
};
