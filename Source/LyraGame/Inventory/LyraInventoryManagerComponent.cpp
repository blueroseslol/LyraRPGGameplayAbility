// Copyright Epic Games, Inc. All Rights Reserved.

#include "LyraInventoryManagerComponent.h"

#include "Engine/ActorChannel.h"
#include "Engine/World.h"
#include "GameFramework/Controller.h"
#include "GameFramework/GameplayMessageSubsystem.h"
#include "GameFramework/Pawn.h"
#include "Kismet/GameplayStatics.h"
#include "LyraInventoryPickup.h"
#include "LyraInventoryItemDefinition.h"
#include "LyraInventoryItemInstance.h"
#include "NativeGameplayTags.h"
#include "Net/UnrealNetwork.h"

#include UE_INLINE_GENERATED_CPP_BY_NAME(LyraInventoryManagerComponent)

class FLifetimeProperty;
struct FReplicationFlags;

UE_DEFINE_GAMEPLAY_TAG_STATIC(TAG_Lyra_Inventory_Message_StackChanged, "Lyra.Inventory.Message.StackChanged");

//////////////////////////////////////////////////////////////////////
// FLyraInventoryEntry

FString FLyraInventoryEntry::GetDebugString() const
{
	TSubclassOf<ULyraInventoryItemDefinition> ItemDef;
	if (Instance != nullptr)
	{
		ItemDef = Instance->GetItemDef();
	}

	return FString::Printf(TEXT("%s (%d x %s)"), *GetNameSafe(Instance), StackCount, *GetNameSafe(ItemDef));
}

//////////////////////////////////////////////////////////////////////
// FLyraInventoryList

void FLyraInventoryList::PreReplicatedRemove(const TArrayView<int32> RemovedIndices, int32 FinalSize)
{
	for (int32 Index : RemovedIndices)
	{
		FLyraInventoryEntry& Stack = Entries[Index];
		BroadcastChangeMessage(Stack, /*OldCount=*/ Stack.StackCount, /*NewCount=*/ 0);
		Stack.LastObservedCount = 0;
	}
}

void FLyraInventoryList::PostReplicatedAdd(const TArrayView<int32> AddedIndices, int32 FinalSize)
{
	for (int32 Index : AddedIndices)
	{
		FLyraInventoryEntry& Stack = Entries[Index];
		BroadcastChangeMessage(Stack, /*OldCount=*/ 0, /*NewCount=*/ Stack.StackCount);
		Stack.LastObservedCount = Stack.StackCount;
	}
}

void FLyraInventoryList::PostReplicatedChange(const TArrayView<int32> ChangedIndices, int32 FinalSize)
{
	for (int32 Index : ChangedIndices)
	{
		FLyraInventoryEntry& Stack = Entries[Index];
		check(Stack.LastObservedCount != INDEX_NONE);
		BroadcastChangeMessage(Stack, /*OldCount=*/ Stack.LastObservedCount, /*NewCount=*/ Stack.StackCount);
		Stack.LastObservedCount = Stack.StackCount;
	}
}

void FLyraInventoryList::BroadcastChangeMessage(FLyraInventoryEntry& Entry, int32 OldCount, int32 NewCount)
{
	FLyraInventoryChangeMessage Message;
	Message.InventoryOwner = OwnerComponent;
	Message.Instance = Entry.Instance;
	Message.NewCount = NewCount;
	Message.Delta = NewCount - OldCount;

	UGameplayMessageSubsystem& MessageSystem = UGameplayMessageSubsystem::Get(OwnerComponent->GetWorld());
	MessageSystem.BroadcastMessage(TAG_Lyra_Inventory_Message_StackChanged, Message);
}

ULyraInventoryItemInstance* FLyraInventoryList::AddEntry(TSubclassOf<ULyraInventoryItemDefinition> ItemDef, int32 StackCount)
{
	ULyraInventoryItemInstance* Result = nullptr;

	check(ItemDef != nullptr);
 	check(OwnerComponent);

	AActor* OwningActor = OwnerComponent->GetOwner();
	check(OwningActor->HasAuthority());


	FLyraInventoryEntry& NewEntry = Entries.AddDefaulted_GetRef();
	NewEntry.Instance = NewObject<ULyraInventoryItemInstance>(OwnerComponent->GetOwner());  //@TODO: Using the actor instead of component as the outer due to UE-127172
	NewEntry.Instance->SetItemDef(ItemDef);
	for (ULyraInventoryItemFragment* Fragment : GetDefault<ULyraInventoryItemDefinition>(ItemDef)->Fragments)
	{
		if (Fragment != nullptr)
		{
			Fragment->OnInstanceCreated(NewEntry.Instance);
		}
	}
	NewEntry.StackCount = StackCount;
	Result = NewEntry.Instance;

	//const ULyraInventoryItemDefinition* ItemCDO = GetDefault<ULyraInventoryItemDefinition>(ItemDef);
	MarkItemDirty(NewEntry);

	return Result;
}

void FLyraInventoryList::AddEntry(ULyraInventoryItemInstance* Instance)
{
	check(Instance != nullptr);
	check(OwnerComponent);

	AActor* OwningActor = OwnerComponent->GetOwner();
	check(OwningActor->HasAuthority());

	FLyraInventoryEntry& NewEntry = Entries.AddDefaulted_GetRef();
	NewEntry.Instance = Instance;
	// An instance-based entry represents a single item; fragments were already
	// run when the instance was created by its producer (e.g. a pickup or a
	// corpse bag), so OnInstanceCreated must not be re-run here.
	NewEntry.StackCount = 1;

	MarkItemDirty(NewEntry);
}

void FLyraInventoryList::RemoveEntry(ULyraInventoryItemInstance* Instance)
{
	for (auto EntryIt = Entries.CreateIterator(); EntryIt; ++EntryIt)
	{
		FLyraInventoryEntry& Entry = *EntryIt;
		if (Entry.Instance == Instance)
		{
			EntryIt.RemoveCurrent();
			MarkArrayDirty();
		}
	}
}

TArray<ULyraInventoryItemInstance*> FLyraInventoryList::GetAllItems() const
{
	TArray<ULyraInventoryItemInstance*> Results;
	Results.Reserve(Entries.Num());
	for (const FLyraInventoryEntry& Entry : Entries)
	{
		if (Entry.Instance != nullptr) //@TODO: Would prefer to not deal with this here and hide it further?
		{
			Results.Add(Entry.Instance);
		}
	}
	return Results;
}

//////////////////////////////////////////////////////////////////////
// ULyraInventoryManagerComponent

ULyraInventoryManagerComponent::ULyraInventoryManagerComponent(const FObjectInitializer& ObjectInitializer)
	: Super(ObjectInitializer)
	, InventoryList(this)
{
	SetIsReplicatedByDefault(true);
	DropPickupClass = ALyraInventoryPickup::StaticClass();
}

void ULyraInventoryManagerComponent::GetLifetimeReplicatedProps(TArray< FLifetimeProperty >& OutLifetimeProps) const
{
	Super::GetLifetimeReplicatedProps(OutLifetimeProps);

	DOREPLIFETIME(ThisClass, InventoryList);
}

bool ULyraInventoryManagerComponent::CanAddItemDefinition(TSubclassOf<ULyraInventoryItemDefinition> ItemDef, int32 StackCount)
{
	//@TODO: Add support for stack limit / uniqueness checks / etc...
	return true;
}

ULyraInventoryItemInstance* ULyraInventoryManagerComponent::AddItemDefinition(TSubclassOf<ULyraInventoryItemDefinition> ItemDef, int32 StackCount)
{
	ULyraInventoryItemInstance* Result = nullptr;
	if (ItemDef != nullptr)
	{
		Result = InventoryList.AddEntry(ItemDef, StackCount);
		
		if (IsUsingRegisteredSubObjectList() && IsReadyForReplication() && Result)
		{
			AddReplicatedSubObject(Result);
		}
	}
	return Result;
}

void ULyraInventoryManagerComponent::AddItemInstance(ULyraInventoryItemInstance* ItemInstance)
{
	AActor* OwningActor = GetOwner();
	if (!IsValid(ItemInstance) || !IsValid(OwningActor) || !OwningActor->HasAuthority())
	{
		return;
	}

	ULyraInventoryItemInstance* InstanceToAdd = ItemInstance;
	if (ItemInstance->GetOuter() != OwningActor)
	{
		InstanceToAdd = DuplicateObject<ULyraInventoryItemInstance>(ItemInstance, OwningActor);
	}

	if (!IsValid(InstanceToAdd))
	{
		return;
	}

	InventoryList.AddEntry(InstanceToAdd);
	if (IsUsingRegisteredSubObjectList() && IsReadyForReplication())
	{
		AddReplicatedSubObject(InstanceToAdd);
	}
}

void ULyraInventoryManagerComponent::RemoveItemInstance(ULyraInventoryItemInstance* ItemInstance)
{
	InventoryList.RemoveEntry(ItemInstance);

	if (ItemInstance && IsUsingRegisteredSubObjectList())
	{
		RemoveReplicatedSubObject(ItemInstance);
	}
}

ELyraInventoryDropResult ULyraInventoryManagerComponent::RequestDropItem(ULyraInventoryItemInstance* ItemInstance)
{
	AActor* OwningActor = GetOwner();
	if (!IsValid(OwningActor))
	{
		return ELyraInventoryDropResult::InvalidOwner;
	}

	if (!IsValid(ItemInstance))
	{
		return ELyraInventoryDropResult::InvalidItem;
	}

	if (!ContainsItemInstance(ItemInstance))
	{
		return ELyraInventoryDropResult::ItemNotOwned;
	}

	if (OwningActor->HasAuthority())
	{
		return DropItemOnAuthority(ItemInstance);
	}

	if (!OwningActor->HasLocalNetOwner())
	{
		return ELyraInventoryDropResult::NotAuthority;
	}

	ServerRequestDropItem(ItemInstance);
	return ELyraInventoryDropResult::RequestSubmitted;
}

void ULyraInventoryManagerComponent::ServerRequestDropItem_Implementation(ULyraInventoryItemInstance* ItemInstance)
{
	const ELyraInventoryDropResult Result = DropItemOnAuthority(ItemInstance);
	ClientNotifyDropItemResult(ItemInstance, Result);
	if (Result != ELyraInventoryDropResult::Success)
	{
		UE_LOG(LogTemp, Warning, TEXT("Inventory drop rejected for %s on %s (result %d)"), *GetNameSafe(ItemInstance), *GetNameSafe(GetOwner()), static_cast<int32>(Result));
	}
}

void ULyraInventoryManagerComponent::ClientNotifyDropItemResult_Implementation(
	ULyraInventoryItemInstance* ItemInstance,
	ELyraInventoryDropResult Result)
{
	OnDropItemResult.Broadcast(ItemInstance, Result);
}

ELyraInventoryDropResult ULyraInventoryManagerComponent::DropItemOnAuthority(ULyraInventoryItemInstance* ItemInstance)
{
	AActor* OwningActor = GetOwner();
	if (!IsValid(OwningActor))
	{
		return ELyraInventoryDropResult::InvalidOwner;
	}

	if (!OwningActor->HasAuthority())
	{
		return ELyraInventoryDropResult::NotAuthority;
	}

	if (!IsValid(ItemInstance))
	{
		return ELyraInventoryDropResult::InvalidItem;
	}

	if (!ContainsItemInstance(ItemInstance))
	{
		return ELyraInventoryDropResult::ItemNotOwned;
	}

	APawn* DropPawn = ResolveDropPawn();
	if (!IsValid(DropPawn))
	{
		return ELyraInventoryDropResult::NoDropPawn;
	}

	UWorld* World = GetWorld();
	if (!IsValid(World))
	{
		return ELyraInventoryDropResult::NoWorld;
	}

	if (!DropPickupClass)
	{
		return ELyraInventoryDropResult::PickupClassNotConfigured;
	}

	const FVector Forward = DropPawn->GetActorForwardVector().GetSafeNormal2D();
	FVector DropLocation = DropPawn->GetActorLocation() + Forward * DropDistance;

	FHitResult GroundHit;
	FCollisionQueryParams TraceParams(SCENE_QUERY_STAT(LyraInventoryDropGround), false, DropPawn);
	const FVector TraceStart = DropLocation + FVector::UpVector * DropTraceHeight;
	const FVector TraceEnd = DropLocation - FVector::UpVector * DropTraceDepth;
	if (World->LineTraceSingleByChannel(GroundHit, TraceStart, TraceEnd, ECC_Visibility, TraceParams))
	{
		DropLocation = GroundHit.ImpactPoint + FVector::UpVector * DropGroundOffset;
	}

	const FTransform DropTransform(DropPawn->GetActorRotation(), DropLocation);
	ALyraInventoryPickup* PickupActor = World->SpawnActorDeferred<ALyraInventoryPickup>(
		DropPickupClass,
		DropTransform,
		OwningActor,
		DropPawn,
		ESpawnActorCollisionHandlingMethod::AdjustIfPossibleButDontSpawnIfColliding);

	if (!IsValid(PickupActor))
	{
		return ELyraInventoryDropResult::SpawnFailed;
	}

	if (!PickupActor->InitializeFromItem(ItemInstance))
	{
		PickupActor->Destroy();
		return ELyraInventoryDropResult::SpawnFailed;
	}

	AActor* FinishedActor = UGameplayStatics::FinishSpawningActor(PickupActor, DropTransform);
	if (!IsValid(FinishedActor))
	{
		return ELyraInventoryDropResult::SpawnFailed;
	}

	RemoveItemInstance(ItemInstance);
	return ELyraInventoryDropResult::Success;
}

void ULyraInventoryManagerComponent::SetDropPickupClass(TSubclassOf<ALyraInventoryPickup> InPickupClass)
{
	if (AActor* OwningActor = GetOwner(); IsValid(OwningActor) && OwningActor->HasAuthority())
	{
		DropPickupClass = InPickupClass;
	}
}

APawn* ULyraInventoryManagerComponent::ResolveDropPawn() const
{
	if (APawn* OwningPawn = Cast<APawn>(GetOwner()))
	{
		return OwningPawn;
	}

	if (const AController* OwningController = Cast<AController>(GetOwner()))
	{
		return OwningController->GetPawn();
	}

	return nullptr;
}

bool ULyraInventoryManagerComponent::ContainsItemInstance(ULyraInventoryItemInstance* ItemInstance) const
{
	return InventoryList.GetAllItems().Contains(ItemInstance);
}

TArray<ULyraInventoryItemInstance*> ULyraInventoryManagerComponent::GetAllItems() const
{
	return InventoryList.GetAllItems();
}

ULyraInventoryItemInstance* ULyraInventoryManagerComponent::FindFirstItemStackByDefinition(TSubclassOf<ULyraInventoryItemDefinition> ItemDef) const
{
	for (const FLyraInventoryEntry& Entry : InventoryList.Entries)
	{
		ULyraInventoryItemInstance* Instance = Entry.Instance;

		if (IsValid(Instance))
		{
			if (Instance->GetItemDef() == ItemDef)
			{
				return Instance;
			}
		}
	}

	return nullptr;
}

int32 ULyraInventoryManagerComponent::GetTotalItemCountByDefinition(TSubclassOf<ULyraInventoryItemDefinition> ItemDef) const
{
	int32 TotalCount = 0;
	for (const FLyraInventoryEntry& Entry : InventoryList.Entries)
	{
		ULyraInventoryItemInstance* Instance = Entry.Instance;

		if (IsValid(Instance))
		{
			if (Instance->GetItemDef() == ItemDef)
			{
				++TotalCount;
			}
		}
	}

	return TotalCount;
}

bool ULyraInventoryManagerComponent::ConsumeItemsByDefinition(TSubclassOf<ULyraInventoryItemDefinition> ItemDef, int32 NumToConsume)
{
	AActor* OwningActor = GetOwner();
	if (!OwningActor || !OwningActor->HasAuthority())
	{
		return false;
	}

	//@TODO: N squared right now as there's no acceleration structure
	int32 TotalConsumed = 0;
	while (TotalConsumed < NumToConsume)
	{
		if (ULyraInventoryItemInstance* Instance = ULyraInventoryManagerComponent::FindFirstItemStackByDefinition(ItemDef))
		{
			InventoryList.RemoveEntry(Instance);
			++TotalConsumed;
		}
		else
		{
			return false;
		}
	}

	return TotalConsumed == NumToConsume;
}

void ULyraInventoryManagerComponent::ReadyForReplication()
{
	Super::ReadyForReplication();

	// Register existing ULyraInventoryItemInstance
	if (IsUsingRegisteredSubObjectList())
	{
		for (const FLyraInventoryEntry& Entry : InventoryList.Entries)
		{
			ULyraInventoryItemInstance* Instance = Entry.Instance;

			if (IsValid(Instance))
			{
				AddReplicatedSubObject(Instance);
			}
		}
	}
}

bool ULyraInventoryManagerComponent::ReplicateSubobjects(UActorChannel* Channel, class FOutBunch* Bunch, FReplicationFlags* RepFlags)
{
	bool WroteSomething = Super::ReplicateSubobjects(Channel, Bunch, RepFlags);

	for (FLyraInventoryEntry& Entry : InventoryList.Entries)
	{
		ULyraInventoryItemInstance* Instance = Entry.Instance;

		if (Instance && IsValid(Instance))
		{
			WroteSomething |= Channel->ReplicateSubobject(Instance, *Bunch, *RepFlags);
		}
	}

	return WroteSomething;
}

//////////////////////////////////////////////////////////////////////
//

// UCLASS(Abstract)
// class ULyraInventoryFilter : public UObject
// {
// public:
// 	virtual bool PassesFilter(ULyraInventoryItemInstance* Instance) const { return true; }
// };

// UCLASS()
// class ULyraInventoryFilter_HasTag : public ULyraInventoryFilter
// {
// public:
// 	virtual bool PassesFilter(ULyraInventoryItemInstance* Instance) const { return true; }
// };
