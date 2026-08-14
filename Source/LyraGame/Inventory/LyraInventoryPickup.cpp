// Copyright Epic Games, Inc. All Rights Reserved.

#include "LyraInventoryPickup.h"

#include "Inventory/LyraInventoryItemInstance.h"

#include UE_INLINE_GENERATED_CPP_BY_NAME(LyraInventoryPickup)

ALyraInventoryPickup::ALyraInventoryPickup()
{
	bReplicates = true;
	SetReplicateMovement(true);
}

bool ALyraInventoryPickup::InitializeFromItem(ULyraInventoryItemInstance* SourceItem)
{
	if (!HasAuthority() || !IsValid(SourceItem))
	{
		return false;
	}

	ULyraInventoryItemInstance* WorldItem = DuplicateObject<ULyraInventoryItemInstance>(SourceItem, this);
	if (!IsValid(WorldItem))
	{
		return false;
	}

	PickupInventory.Instances.Reset();
	PickupInventory.Templates.Reset();
	FPickupInstance& PickupInstance = PickupInventory.Instances.AddDefaulted_GetRef();
	PickupInstance.Item = WorldItem;
	return true;
}

void ALyraInventoryPickup::GatherInteractionOptions(const FInteractionQuery& InteractQuery, FInteractionOptionBuilder& InteractionBuilder)
{
	InteractionBuilder.AddInteractionOption(InteractionOption);
}

FInventoryPickup ALyraInventoryPickup::GetPickupInventory() const
{
	return PickupInventory;
}
