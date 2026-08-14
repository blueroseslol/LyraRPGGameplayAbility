// Copyright Epic Games, Inc. All Rights Reserved.

#if WITH_DEV_AUTOMATION_TESTS

#include "Engine/World.h"
#include "EngineUtils.h"
#include "GameFramework/Actor.h"
#include "GameFramework/Pawn.h"
#include "Inventory/IPickupable.h"
#include "Inventory/LyraInventoryDropTypes.h"
#include "Inventory/LyraInventoryItemDefinition.h"
#include "Inventory/LyraInventoryItemInstance.h"
#include "Inventory/LyraInventoryManagerComponent.h"
#include "Inventory/LyraInventoryPickup.h"
#include "Misc/AutomationTest.h"
#include "NativeGameplayTags.h"

namespace Lyra::Inventory::Tests
{
	UE_DEFINE_GAMEPLAY_TAG_STATIC(TAG_Test_ItemStatTag, "Lyra.Inventory.Test.StatTag");
}

IMPLEMENT_SIMPLE_AUTOMATION_TEST(
	FLyraInventoryAddItemInstanceTest,
	"LyraGame.Inventory.AddItemInstance",
	EAutomationTestFlags_ApplicationContextMask | EAutomationTestFlags::EngineFilter)

bool FLyraInventoryAddItemInstanceTest::RunTest(const FString& Parameters)
{
	UWorld* World = UWorld::CreateWorld(EWorldType::Game, /*bInformEngineOfWorld=*/false);
	if (World == nullptr)
	{
		AddError(TEXT("Failed to create a standalone test world"));
		return false;
	}

	FActorSpawnParameters SpawnParams;
	SpawnParams.ObjectFlags |= RF_Transient;
	AActor* TestActor = World->SpawnActor<AActor>(AActor::StaticClass(), FVector::ZeroVector, FRotator::ZeroRotator, SpawnParams);
	if (TestActor == nullptr)
	{
		World->DestroyWorld(false);
		AddError(TEXT("Failed to spawn the inventory owner actor"));
		return false;
	}

	ULyraInventoryManagerComponent* InventoryComponent = NewObject<ULyraInventoryManagerComponent>(TestActor);
	InventoryComponent->RegisterComponent();

	// Instance-based add: the instance is queryable after AddItemInstance
	ULyraInventoryItemInstance* ItemInstance = NewObject<ULyraInventoryItemInstance>(TestActor);
	ItemInstance->AddStatTagStack(Lyra::Inventory::Tests::TAG_Test_ItemStatTag, 3);
	InventoryComponent->AddItemInstance(ItemInstance);

	const TArray<ULyraInventoryItemInstance*> AllItems = InventoryComponent->GetAllItems();
	TestTrue(TEXT("加入后可通过 GetAllItems 查询到实例"), AllItems.Num() == 1 && AllItems[0] == ItemInstance);

	// Stat tags survive the add
	TestEqual(
		TEXT("StatTags 在加入背包后保持"),
		ItemInstance->GetStatTagStackCount(Lyra::Inventory::Tests::TAG_Test_ItemStatTag),
		3);

	// A second instance can coexist
	ULyraInventoryItemInstance* SecondInstance = NewObject<ULyraInventoryItemInstance>(TestActor);
	InventoryComponent->AddItemInstance(SecondInstance);
	TestEqual(TEXT("多个实例可共存"), InventoryComponent->GetAllItems().Num(), 2);

	// Definition-based add still works (regression for the shared list path)
	ULyraInventoryItemInstance* DefInstance = InventoryComponent->AddItemDefinition(ULyraInventoryItemDefinition::StaticClass(), 1);
	TestNotNull(TEXT("AddItemDefinition 路径仍然可用"), DefInstance);
	TestEqual(TEXT("AddItemDefinition 与 AddItemInstance 混合后数量正确"), InventoryComponent->GetAllItems().Num(), 3);

	// RemoveItemInstance removes exactly the given instance
	InventoryComponent->RemoveItemInstance(ItemInstance);
	TestEqual(TEXT("RemoveItemInstance 只移除指定实例"), InventoryComponent->GetAllItems().Num(), 2);

	TestActor->Destroy();
	World->DestroyWorld(false);

	return true;
}

IMPLEMENT_SIMPLE_AUTOMATION_TEST(
	FLyraInventoryCrossActorOuterTest,
	"LyraGame.Inventory.AddItemInstance.CrossActorOuter",
	EAutomationTestFlags_ApplicationContextMask | EAutomationTestFlags::EngineFilter)

bool FLyraInventoryCrossActorOuterTest::RunTest(const FString& Parameters)
{
	UWorld* World = UWorld::CreateWorld(EWorldType::Game, /*bInformEngineOfWorld=*/false);
	if (World == nullptr)
	{
		AddError(TEXT("Failed to create a standalone test world"));
		return false;
	}

	FActorSpawnParameters SpawnParams;
	SpawnParams.ObjectFlags |= RF_Transient;
	AActor* SourceActor = World->SpawnActor<AActor>(AActor::StaticClass(), FVector::ZeroVector, FRotator::ZeroRotator, SpawnParams);
	AActor* TargetActor = World->SpawnActor<AActor>(AActor::StaticClass(), FVector(100.0, 0.0, 0.0), FRotator::ZeroRotator, SpawnParams);
	if (SourceActor == nullptr || TargetActor == nullptr)
	{
		World->DestroyWorld(false);
		AddError(TEXT("Failed to spawn inventory owner actors"));
		return false;
	}

	ULyraInventoryManagerComponent* SourceInventory = NewObject<ULyraInventoryManagerComponent>(SourceActor);
	SourceInventory->RegisterComponent();
	ULyraInventoryManagerComponent* TargetInventory = NewObject<ULyraInventoryManagerComponent>(TargetActor);
	TargetInventory->RegisterComponent();

	ULyraInventoryItemInstance* SourceItem = SourceInventory->AddItemDefinition(ULyraInventoryItemDefinition::StaticClass(), 1);
	SourceItem->AddStatTagStack(Lyra::Inventory::Tests::TAG_Test_ItemStatTag, 7);
	TargetInventory->AddItemInstance(SourceItem);

	const TArray<ULyraInventoryItemInstance*> TargetItems = TargetInventory->GetAllItems();
	TestEqual(TEXT("跨 Actor 加入后目标背包包含一个物品"), TargetItems.Num(), 1);
	if (TargetItems.Num() == 1)
	{
		ULyraInventoryItemInstance* CopiedItem = TargetItems[0];
		TestNotEqual(TEXT("跨 Actor 加入时复制实例"), CopiedItem, SourceItem);
		TestEqual(TEXT("复制实例的 Outer 是目标背包 Owner Actor"), CopiedItem->GetOuter(), static_cast<UObject*>(TargetActor));
		TestEqual(TEXT("复制实例保留 ItemDef"), CopiedItem->GetItemDef(), SourceItem->GetItemDef());
		TestEqual(TEXT("复制实例保留 StatTags"), CopiedItem->GetStatTagStackCount(Lyra::Inventory::Tests::TAG_Test_ItemStatTag), 7);
	}

	SourceActor->Destroy();
	TargetActor->Destroy();
	World->DestroyWorld(false);
	return true;
}

IMPLEMENT_SIMPLE_AUTOMATION_TEST(
	FLyraInventoryDropItemTest,
	"LyraGame.Inventory.DropItem",
	EAutomationTestFlags_ApplicationContextMask | EAutomationTestFlags::EngineFilter)

bool FLyraInventoryDropItemTest::RunTest(const FString& Parameters)
{
	UWorld* World = UWorld::CreateWorld(EWorldType::Game, /*bInformEngineOfWorld=*/false);
	if (World == nullptr)
	{
		AddError(TEXT("Failed to create a standalone test world"));
		return false;
	}

	FActorSpawnParameters SpawnParams;
	SpawnParams.ObjectFlags |= RF_Transient;
	APawn* Pawn = World->SpawnActor<APawn>(APawn::StaticClass(), FVector::ZeroVector, FRotator::ZeroRotator, SpawnParams);
	if (Pawn == nullptr)
	{
		World->DestroyWorld(false);
		AddError(TEXT("Failed to spawn the inventory pawn"));
		return false;
	}

	ULyraInventoryManagerComponent* Inventory = NewObject<ULyraInventoryManagerComponent>(Pawn);
	Inventory->RegisterComponent();

	ULyraInventoryItemInstance* Item = Inventory->AddItemDefinition(ULyraInventoryItemDefinition::StaticClass(), 1);
	Item->AddStatTagStack(Lyra::Inventory::Tests::TAG_Test_ItemStatTag, 5);

	ULyraInventoryItemInstance* ForeignItem = NewObject<ULyraInventoryItemInstance>(Pawn);
	TestEqual(
		TEXT("非归属物品被拒绝"),
		Inventory->DropItemOnAuthority(ForeignItem),
		ELyraInventoryDropResult::ItemNotOwned);

	TestEqual(
		TEXT("服务器成功丢弃归属物品"),
		Inventory->DropItemOnAuthority(Item),
		ELyraInventoryDropResult::Success);
	TestEqual(TEXT("成功生成后才移除背包条目"), Inventory->GetAllItems().Num(), 0);

	TestEqual(
		TEXT("同一实例重复请求被归属校验拒绝"),
		Inventory->DropItemOnAuthority(Item),
		ELyraInventoryDropResult::ItemNotOwned);

	ALyraInventoryPickup* SpawnedPickup = nullptr;
	int32 PickupCount = 0;
	for (TActorIterator<ALyraInventoryPickup> It(World); It; ++It)
	{
		SpawnedPickup = *It;
		++PickupCount;
	}
	TestEqual(TEXT("重复请求最多生成一个世界拾取物"), PickupCount, 1);
	TestNotNull(TEXT("丢弃生成通用世界拾取 Actor"), SpawnedPickup);

	if (SpawnedPickup != nullptr)
	{
		const FInventoryPickup PickupPayload = SpawnedPickup->GetPickupInventory();
		TestEqual(TEXT("世界拾取物包含一个实例"), PickupPayload.Instances.Num(), 1);
		if (PickupPayload.Instances.Num() == 1)
		{
			ULyraInventoryItemInstance* WorldItem = PickupPayload.Instances[0].Item;
			TestEqual(TEXT("世界物品 Outer 是世界拾取 Actor"), WorldItem->GetOuter(), static_cast<UObject*>(SpawnedPickup));
			TestEqual(TEXT("世界物品保留 ItemDef"), WorldItem->GetItemDef(), Item->GetItemDef());
			TestEqual(TEXT("世界物品保留 StatTags"), WorldItem->GetStatTagStackCount(Lyra::Inventory::Tests::TAG_Test_ItemStatTag), 5);
		}

		TScriptInterface<IPickupable> PickupInterface(SpawnedPickup);
		UPickupableStatics::AddPickupToInventory(Inventory, PickupInterface);
		const TArray<ULyraInventoryItemInstance*> RepickedItems = Inventory->GetAllItems();
		TestEqual(TEXT("重新拾取后物品回到背包"), RepickedItems.Num(), 1);
		if (RepickedItems.Num() == 1)
		{
			TestEqual(TEXT("重新拾取实例 Outer 回到背包 Owner Actor"), RepickedItems[0]->GetOuter(), static_cast<UObject*>(Pawn));
			TestEqual(TEXT("重新拾取后 StatTags 保持"), RepickedItems[0]->GetStatTagStackCount(Lyra::Inventory::Tests::TAG_Test_ItemStatTag), 5);
		}

		SpawnedPickup->Destroy();
	}

	ULyraInventoryItemInstance* FailureItem = Inventory->AddItemDefinition(ULyraInventoryItemDefinition::StaticClass(), 1);
	const int32 CountBeforeFailure = Inventory->GetAllItems().Num();
	Inventory->SetDropPickupClass(nullptr);
	TestEqual(
		TEXT("未配置世界拾取类时返回可诊断失败"),
		Inventory->DropItemOnAuthority(FailureItem),
		ELyraInventoryDropResult::PickupClassNotConfigured);
	TestEqual(TEXT("生成失败时背包保持不变"), Inventory->GetAllItems().Num(), CountBeforeFailure);

	Pawn->Destroy();
	World->DestroyWorld(false);
	return true;
}

#endif // WITH_DEV_AUTOMATION_TESTS
