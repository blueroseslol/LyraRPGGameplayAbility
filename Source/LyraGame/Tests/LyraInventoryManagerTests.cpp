// Copyright Epic Games, Inc. All Rights Reserved.

#if WITH_DEV_AUTOMATION_TESTS

#include "Engine/World.h"
#include "GameFramework/Actor.h"
#include "Inventory/LyraInventoryItemDefinition.h"
#include "Inventory/LyraInventoryItemInstance.h"
#include "Inventory/LyraInventoryManagerComponent.h"
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

#endif // WITH_DEV_AUTOMATION_TESTS
