import type { IRankCalculationStrategy } from './interfaces/rank-calculation-strategy.interface';

interface RankThreshold {
  rank: number;
  requiredExperience: number;
}

export class DefaultRankCalculationStrategy
  implements IRankCalculationStrategy
{
  private static readonly RANK_PROGRESS: ReadonlyArray<RankThreshold> = [
    { rank: 1, requiredExperience: 0 },
    { rank: 2, requiredExperience: 500 },
    { rank: 3, requiredExperience: 1000 },
    { rank: 4, requiredExperience: 2000 },
    { rank: 5, requiredExperience: 4000 },
  ];

  calculate(experiencePoints: number): number {
    let currentRank =
      DefaultRankCalculationStrategy.RANK_PROGRESS[0].rank;

    for (const progress of DefaultRankCalculationStrategy.RANK_PROGRESS) {
      if (experiencePoints >= progress.requiredExperience) {
        currentRank = progress.rank;
      }
    }

    return currentRank;
  }
}