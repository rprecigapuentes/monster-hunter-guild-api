import { DefaultRankCalculationStrategy } from '../../../src/strategies/rank/default-rank-calculation.strategy';

describe('DefaultRankCalculationStrategy', () => {
  const strategy = new DefaultRankCalculationStrategy();

  it('Should return rank 1 for 0 experience', () => {
    expect(strategy.calculate(0)).toBe(1);
  });

  it('Should return rank 2 for 500 experience', () => {
    expect(strategy.calculate(500)).toBe(2);
  });

  it('Should return rank 3 for 1500 experience', () => {
    expect(strategy.calculate(1500)).toBe(3);
  });

  it('Should return rank 5 for 5000 experience', () => {
    expect(strategy.calculate(5000)).toBe(5);
  });
});