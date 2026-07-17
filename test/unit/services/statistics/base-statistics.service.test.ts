import {
  BaseStatisticsService,
  StatisticNotFoundError,
} from '../../../../src/services/statistics/base-statistics.service';

class TestStatisticsService extends BaseStatisticsService {
  readonly entity = 'test-entity';

  registerStat(name: string, fn: () => Promise<unknown>): void {
    this.statistics.set(name, fn);
  }
}

describe('BaseStatisticsService', () => {
  let service: TestStatisticsService;

  beforeEach(() => {
    service = new TestStatisticsService();
  });

  describe('getStatistics', () => {
    it('Should return the resolved value of every registered statistic', async () => {
      service.registerStat('count', async () => 10);
      service.registerStat('averageReward', async () => 1250.5);

      const result = await service.getStatistics();

      expect(result).toEqual({ count: 10, averageReward: 1250.5 });
    });

    it('Should return an empty object when no statistics are registered', async () => {
      const result = await service.getStatistics();

      expect(result).toEqual({});
    });

    it('Should call every registered statistic function exactly once', async () => {
      const countFn = jest.fn().mockResolvedValue(10);
      service.registerStat('count', countFn);

      await service.getStatistics();

      expect(countFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('getStatistic', () => {
    it('Should return the resolved value for a registered statistic', async () => {
      service.registerStat('count', async () => 10);

      const result = await service.getStatistic('count');

      expect(result).toBe(10);
    });

    it('Should throw StatisticNotFoundError when the statistic is not registered', async () => {
      await expect(service.getStatistic('nonexistent')).rejects.toThrow(StatisticNotFoundError);
      await expect(service.getStatistic('nonexistent')).rejects.toThrow(
        "Statistic 'nonexistent' not found for entity 'test-entity'"
      );
    });

    it('Should not call unrelated statistics when only one is requested', async () => {
      const countFn = jest.fn().mockResolvedValue(10);
      const avgFn = jest.fn().mockResolvedValue(1250.5);
      service.registerStat('count', countFn);
      service.registerStat('averageReward', avgFn);

      await service.getStatistic('count');

      expect(countFn).toHaveBeenCalledTimes(1);
      expect(avgFn).not.toHaveBeenCalled();
    });
  });
});
