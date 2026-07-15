export interface IRankCalculationStrategy {
  calculate(experiencePoints: number): number;
}