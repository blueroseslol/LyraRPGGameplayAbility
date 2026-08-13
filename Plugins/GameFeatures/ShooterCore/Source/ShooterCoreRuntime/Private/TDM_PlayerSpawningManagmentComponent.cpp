// Copyright Epic Games, Inc. All Rights Reserved.

#include "TDM_PlayerSpawningManagmentComponent.h"

#include "Engine/World.h"
#include "GameFramework/PlayerState.h"
#include "GameModes/LyraGameState.h"
#include "Player/LyraPlayerStart.h"
#include "Teams/LyraTeamSubsystem.h"

#include UE_INLINE_GENERATED_CPP_BY_NAME(TDM_PlayerSpawningManagmentComponent)

class AActor;

UTDM_PlayerSpawningManagmentComponent::UTDM_PlayerSpawningManagmentComponent(const FObjectInitializer& ObjectInitializer)
	: Super(ObjectInitializer)
{
}

AActor* UTDM_PlayerSpawningManagmentComponent::OnChoosePlayerStart(AController* Player, TArray<ALyraPlayerStart*>& PlayerStarts)
{
	ULyraTeamSubsystem* TeamSubsystem = GetWorld()->GetSubsystem<ULyraTeamSubsystem>();
	if (!ensure(TeamSubsystem))
	{
		return nullptr;
	}

	const int32 PlayerTeamId = TeamSubsystem->FindTeamFromObject(Player);

	// We should have a TeamId by now, but early login stuff before post login can try to do stuff, ignore it.
	if (!ensure(PlayerTeamId != INDEX_NONE))
	{
		return nullptr;
	}

	auto HasTeamSpawnTag = [](ALyraPlayerStart* PlayerStart, int32 DesiredTeamId)
	{
		if (!PlayerStart)
		{
			return false;
		}

		for (const FGameplayTag& StartTag : PlayerStart->GetGameplayTags())
		{
			TArray<FString> TagSegments;
			StartTag.ToString().ParseIntoArray(TagSegments, TEXT("."), true);

			if ((TagSegments.Num() == 3)
				&& TagSegments[0].Equals(TEXT("Spawn"), ESearchCase::IgnoreCase)
				&& TagSegments[1].Equals(TEXT("Team"), ESearchCase::IgnoreCase))
			{
				if (TagSegments[2].IsNumeric() && (FCString::Atoi(*TagSegments[2]) == DesiredTeamId))
				{
					return true;
				}
			}
		}

		return false;
	};

	// Spawn.Team.1 is the opt-in marker so maps without team tags keep their original behavior.
	const bool bUsesTeamSpecificStarts = PlayerStarts.ContainsByPredicate(
		[&HasTeamSpawnTag](ALyraPlayerStart* PlayerStart)
		{
			return HasTeamSpawnTag(PlayerStart, 1);
		});

	TArray<ALyraPlayerStart*> CandidatePlayerStarts;
	if (bUsesTeamSpecificStarts)
	{
		for (ALyraPlayerStart* PlayerStart : PlayerStarts)
		{
			if (HasTeamSpawnTag(PlayerStart, PlayerTeamId))
			{
				CandidatePlayerStarts.Add(PlayerStart);
			}
		}

		if (CandidatePlayerStarts.IsEmpty())
		{
			UE_LOG(LogTemp, Warning,
				TEXT("No LyraPlayerStart tagged Spawn.Team.%d was found; falling back to all player starts."),
				PlayerTeamId);
			CandidatePlayerStarts = PlayerStarts;
		}
	}
	else
	{
		CandidatePlayerStarts = PlayerStarts;
	}

	ALyraGameState* GameState = GetGameStateChecked<ALyraGameState>();

	ALyraPlayerStart* BestPlayerStart = nullptr;
	double MaxDistance = 0;
	ALyraPlayerStart* FallbackPlayerStart = nullptr;
	double FallbackMaxDistance = 0;

	for (APlayerState* PS : GameState->PlayerArray)
	{
		const int32 TeamId = TeamSubsystem->FindTeamFromObject(PS);
		
		// We should have a TeamId by now...
		if (PS->IsOnlyASpectator() || !ensure(TeamId != INDEX_NONE))
		{
			continue;
		}

		// If the other player isn't on the same team, lets find the furthest spawn from them.
		if (TeamId != PlayerTeamId)
		{
			for (ALyraPlayerStart* PlayerStart : CandidatePlayerStarts)
			{
				if (APawn* Pawn = PS->GetPawn())
				{
					const double Distance = PlayerStart->GetDistanceTo(Pawn);

					if (PlayerStart->IsClaimed())
					{
						if (FallbackPlayerStart == nullptr || Distance > FallbackMaxDistance)
						{
							FallbackPlayerStart = PlayerStart;
							FallbackMaxDistance = Distance;
						}
					}
					else if (PlayerStart->GetLocationOccupancy(Player) < ELyraPlayerStartLocationOccupancy::Full)
					{
						if (BestPlayerStart == nullptr || Distance > MaxDistance)
						{
							BestPlayerStart = PlayerStart;
							MaxDistance = Distance;
						}
					}
				}
			}
		}
	}

	if (BestPlayerStart)
	{
		return BestPlayerStart;
	}

	if (FallbackPlayerStart)
	{
		return FallbackPlayerStart;
	}

	return GetFirstRandomUnoccupiedPlayerStart(Player, CandidatePlayerStarts);
}

void UTDM_PlayerSpawningManagmentComponent::OnFinishRestartPlayer(AController* Player, const FRotator& StartRotation)
{
	
}
