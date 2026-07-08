import { RankCalculator } from '../../../src/services/rank-calculator';

describe('RankCalculator', () => {
  let calculator: RankCalculator;

  beforeEach(() => {
    calculator = new RankCalculator();
  });

  describe('calculate', () => {
    it.each([
      [0, 1],
      [499, 1],
      [500, 2],
      [999, 2],
      [1000, 3],
      [1999, 3],
      [2000, 4],
      [3999, 4],
      [4000, 5],
      [10000, 5],
    ])('should return rank %i for %i experience points', (experience, expectedRank) => {
      expect(calculator.calculate(experience)).toBe(expectedRank);
    });
  });
});