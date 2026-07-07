export interface IRankCalculator {
  calculate(experience: number): number;
}

export interface RankThreshold {
  rank: number;
  requiredExperience: number;
}
