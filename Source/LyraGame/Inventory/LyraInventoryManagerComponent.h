// Copyright Epic Games, Inc. All Rights Reserved.

#pragma once

#include "Components/ActorComponent.h"
#include "Inventory/LyraInventoryDropTypes.h"
#include "Net/Serialization/FastArraySerializer.h"

#include "LyraInventoryManagerComponent.generated.h"

#define UE_API LYRAGAME_API

class ULyraInventoryItemDefinition;
class ULyraInventoryItemInstance;
class ULyraInventoryManagerComponent;
class ALyraInventoryPickup;
class APawn;
class UObject;
struct FFrame;
struct FLyraInventoryList;
struct FNetDeltaSerializeInfo;
struct FReplicationFlags;

/** A message when an item is added to the inventory */
USTRUCT(BlueprintType)
struct FLyraInventoryChangeMessage
{
	GENERATED_BODY()

	//@TODO: Tag based names+owning actors for inventories instead of directly exposing the component?
	UPROPERTY(BlueprintReadOnly, Category=Inventory)
	TObjectPtr<UActorComponent> InventoryOwner = nullptr;

	UPROPERTY(BlueprintReadOnly, Category = Inventory)
	TObjectPtr<ULyraInventoryItemInstance> Instance = nullptr;

	UPROPERTY(BlueprintReadOnly, Category=Inventory)
	int32 NewCount = 0;

	UPROPERTY(BlueprintReadOnly, Category=Inventory)
	int32 Delta = 0;
};

/** A single entry in an inventory */
USTRUCT(BlueprintType)
struct FLyraInventoryEntry : public FFastArraySerializerItem
{
	GENERATED_BODY()

	FLyraInventoryEntry()
	{}

	FString GetDebugString() const;

private:
	friend FLyraInventoryList;
	friend ULyraInventoryManagerComponent;

	UPROPERTY()
	TObjectPtr<ULyraInventoryItemInstance> Instance = nullptr;

	UPROPERTY()
	int32 StackCount = 0;

	UPROPERTY(NotReplicated)
	int32 LastObservedCount = INDEX_NONE;
};

/** List of inventory items */
USTRUCT(BlueprintType)
struct FLyraInventoryList : public FFastArraySerializer
{
	GENERATED_BODY()

	FLyraInventoryList()
		: OwnerComponent(nullptr)
	{
	}

	FLyraInventoryList(UActorComponent* InOwnerComponent)
		: OwnerComponent(InOwnerComponent)
	{
	}

	TArray<ULyraInventoryItemInstance*> GetAllItems() const;

public:
	//~FFastArraySerializer contract
	void PreReplicatedRemove(const TArrayView<int32> RemovedIndices, int32 FinalSize);
	void PostReplicatedAdd(const TArrayView<int32> AddedIndices, int32 FinalSize);
	void PostReplicatedChange(const TArrayView<int32> ChangedIndices, int32 FinalSize);
	//~End of FFastArraySerializer contract

	bool NetDeltaSerialize(FNetDeltaSerializeInfo& DeltaParms)
	{
		return FFastArraySerializer::FastArrayDeltaSerialize<FLyraInventoryEntry, FLyraInventoryList>(Entries, DeltaParms, *this);
	}

	ULyraInventoryItemInstance* AddEntry(TSubclassOf<ULyraInventoryItemDefinition> ItemClass, int32 StackCount);
	void AddEntry(ULyraInventoryItemInstance* Instance);

	void RemoveEntry(ULyraInventoryItemInstance* Instance);

private:
	void BroadcastChangeMessage(FLyraInventoryEntry& Entry, int32 OldCount, int32 NewCount);

private:
	friend ULyraInventoryManagerComponent;

private:
	// Replicated list of items
	UPROPERTY()
	TArray<FLyraInventoryEntry> Entries;

	UPROPERTY(NotReplicated)
	TObjectPtr<UActorComponent> OwnerComponent;
};

template<>
struct TStructOpsTypeTraits<FLyraInventoryList> : public TStructOpsTypeTraitsBase2<FLyraInventoryList>
{
	enum { WithNetDeltaSerializer = true };
};










/**
 * Manages an inventory
 */
UCLASS(MinimalAPI, BlueprintType)
class ULyraInventoryManagerComponent : public UActorComponent
{
	GENERATED_BODY()

public:
	UE_API ULyraInventoryManagerComponent(const FObjectInitializer& ObjectInitializer = FObjectInitializer::Get());

	UFUNCTION(BlueprintCallable, BlueprintAuthorityOnly, Category=Inventory)
	UE_API bool CanAddItemDefinition(TSubclassOf<ULyraInventoryItemDefinition> ItemDef, int32 StackCount = 1);

	UFUNCTION(BlueprintCallable, BlueprintAuthorityOnly, Category=Inventory)
	UE_API ULyraInventoryItemInstance* AddItemDefinition(TSubclassOf<ULyraInventoryItemDefinition> ItemDef, int32 StackCount = 1);

	UFUNCTION(BlueprintCallable, BlueprintAuthorityOnly, Category=Inventory)
	UE_API void AddItemInstance(ULyraInventoryItemInstance* ItemInstance);

	UFUNCTION(BlueprintCallable, BlueprintAuthorityOnly, Category=Inventory)
	UE_API void RemoveItemInstance(ULyraInventoryItemInstance* ItemInstance);

	/** Submit a drop intent. Owning clients forward it to the server; authority executes immediately. */
	UFUNCTION(BlueprintCallable, Category = "Inventory|Drop")
	UE_API ELyraInventoryDropResult RequestDropItem(ULyraInventoryItemInstance* ItemInstance);

	/** Execute the transactional server-side drop operation. */
	UFUNCTION(BlueprintCallable, BlueprintAuthorityOnly, Category = "Inventory|Drop")
	UE_API ELyraInventoryDropResult DropItemOnAuthority(ULyraInventoryItemInstance* ItemInstance);

	UFUNCTION(BlueprintCallable, BlueprintAuthorityOnly, Category = "Inventory|Drop")
	UE_API void SetDropPickupClass(TSubclassOf<ALyraInventoryPickup> InPickupClass);

	/** Owning-client notification for the asynchronous Server RPC result. */
	UPROPERTY(BlueprintAssignable, Category = "Inventory|Drop")
	FLyraInventoryDropResultDelegate OnDropItemResult;

	UFUNCTION(BlueprintCallable, Category=Inventory, BlueprintPure=false)
	UE_API TArray<ULyraInventoryItemInstance*> GetAllItems() const;

	UFUNCTION(BlueprintCallable, Category=Inventory, BlueprintPure)
	UE_API ULyraInventoryItemInstance* FindFirstItemStackByDefinition(TSubclassOf<ULyraInventoryItemDefinition> ItemDef) const;

	UE_API int32 GetTotalItemCountByDefinition(TSubclassOf<ULyraInventoryItemDefinition> ItemDef) const;
	UE_API bool ConsumeItemsByDefinition(TSubclassOf<ULyraInventoryItemDefinition> ItemDef, int32 NumToConsume);

	//~UObject interface
	UE_API virtual bool ReplicateSubobjects(class UActorChannel* Channel, class FOutBunch* Bunch, FReplicationFlags* RepFlags) override;
	UE_API virtual void ReadyForReplication() override;
	//~End of UObject interface

private:
	UFUNCTION(Server, Reliable)
	void ServerRequestDropItem(ULyraInventoryItemInstance* ItemInstance);

	UFUNCTION(Client, Reliable)
	void ClientNotifyDropItemResult(ULyraInventoryItemInstance* ItemInstance, ELyraInventoryDropResult Result);

	APawn* ResolveDropPawn() const;

	bool ContainsItemInstance(ULyraInventoryItemInstance* ItemInstance) const;

	UPROPERTY(EditAnywhere, Category = "Inventory|Drop")
	TSubclassOf<ALyraInventoryPickup> DropPickupClass;

	UPROPERTY(EditAnywhere, Category = "Inventory|Drop", meta = (ClampMin = "0.0", Units = "cm"))
	float DropDistance = 150.0f;

	UPROPERTY(EditAnywhere, Category = "Inventory|Drop", meta = (ClampMin = "0.0", Units = "cm"))
	float DropTraceHeight = 100.0f;

	UPROPERTY(EditAnywhere, Category = "Inventory|Drop", meta = (ClampMin = "0.0", Units = "cm"))
	float DropTraceDepth = 300.0f;

	UPROPERTY(EditAnywhere, Category = "Inventory|Drop", meta = (ClampMin = "0.0", Units = "cm"))
	float DropGroundOffset = 20.0f;

	UPROPERTY(Replicated)
	FLyraInventoryList InventoryList;
};

#undef UE_API
