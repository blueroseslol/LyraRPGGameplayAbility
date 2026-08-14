// Copyright Epic Games, Inc. All Rights Reserved.

#pragma once

#include "GameFramework/Actor.h"
#include "Interaction/IInteractableTarget.h"
#include "Interaction/InteractionOption.h"
#include "Inventory/IPickupable.h"

#include "LyraInventoryPickup.generated.h"

class ULyraInventoryItemInstance;
struct FInteractionQuery;

/**
 * Generic runtime pickup used when an inventory item is dropped into the world.
 * Visuals, collision, and the interaction ability are supplied by a Blueprint subclass.
 */
UCLASS(Blueprintable)
class LYRAGAME_API ALyraInventoryPickup : public AActor, public IInteractableTarget, public IPickupable
{
	GENERATED_BODY()

public:
	ALyraInventoryPickup();

	/** Copies an inventory item into this actor so the replicated UObject has a valid Actor outer. */
	UFUNCTION(BlueprintCallable, BlueprintAuthorityOnly, Category = "Inventory|Pickup")
	bool InitializeFromItem(ULyraInventoryItemInstance* SourceItem);

	virtual void GatherInteractionOptions(const FInteractionQuery& InteractQuery, FInteractionOptionBuilder& InteractionBuilder) override;
	virtual FInventoryPickup GetPickupInventory() const override;

protected:
	/** Configure GA_Interaction_Collect and prompt text on the Blueprint subclass. */
	UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category = "Inventory|Pickup")
	FInteractionOption InteractionOption;

private:
	/** Server-authoritative item payload. Pickup execution reads it on the server. */
	UPROPERTY(VisibleInstanceOnly, BlueprintReadOnly, Category = "Inventory|Pickup", meta = (AllowPrivateAccess = "true"))
	FInventoryPickup PickupInventory;
};
