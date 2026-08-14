// Copyright Epic Games, Inc. All Rights Reserved.

#pragma once

#include "LyraInventoryDropTypes.generated.h"

class ULyraInventoryItemInstance;

/** Result of submitting or executing an inventory item drop. */
UENUM(BlueprintType)
enum class ELyraInventoryDropResult : uint8
{
	Success,
	RequestSubmitted,
	InvalidOwner,
	NotAuthority,
	InvalidItem,
	ItemNotOwned,
	NoDropPawn,
	NoWorld,
	PickupClassNotConfigured,
	SpawnFailed
};

DECLARE_DYNAMIC_MULTICAST_DELEGATE_TwoParams(
	FLyraInventoryDropResultDelegate,
	ULyraInventoryItemInstance*, ItemInstance,
	ELyraInventoryDropResult, Result);
