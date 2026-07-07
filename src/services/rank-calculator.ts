import { IRankCalculator } from "./rank-calculator.interface";

export class RankCalculator implements IRankCalculator{
    private static readonly RANK_PROGRESS: ReadonlyArray<{rank: number; requiredExperience: number }> = [
        { rank: 1, requiredExperience: 0},
        { rank: 2, requiredExperience: 500},
        { rank: 3, requiredExperience: 1000},
        { rank: 4, requiredExperience: 2000},
        { rank: 5, requiredExperience: 4000}
    ]

    calculate(experience: number): number {
        let currentRank = RankCalculator.RANK_PROGRESS[0].rank;

        for(const rank_progress of RankCalculator.RANK_PROGRESS){
            if(experience >= rank_progress.requiredExperience){
                currentRank = rank_progress.rank;
            }
        }
        return currentRank;
    }
}