import {
  StatisticsService,
  EntityStatisticsNotFoundError,
} from '../../../../src/services/statistics/statistics.service';
import type { IEntityStatistics } from '../../../../src/services/statistics/entity-statistics.interface';
import { StatisticNotFoundError } from '../../../../src/services/statistics/base-statistics.service';
import { GlobalStatisticNotFoundError } from '../../../../src/services/statistics/statistics.service';

describe('StatisticsService', () => {
  let service: StatisticsService;
  let mockQuestStatistics: jest.Mocked<IEntityStatistics>;
  let mockHunterStatistics: jest.Mocked<IEntityStatistics>;

  beforeEach(() => {
    mockQuestStatistics = {
      entity: 'quests',
      getStatistics: jest.fn(),
      getStatistic: jest.fn(),
    };

    mockHunterStatistics = {
      entity: 'hunters',
      getStatistics: jest.fn(),
      getStatistic: jest.fn(),
    };

    service = new StatisticsService({
      statistics: [mockQuestStatistics, mockHunterStatistics],
    });
  });

  describe('getStatistics', () => {
    it('Should return the statistics for the given entity', async () => {
      const stats = { count: 10, averageReward: 1250.5 };
      mockQuestStatistics.getStatistics.mockResolvedValue(stats);

      const result = await service.getStatistics('quests');

      expect(mockQuestStatistics.getStatistics).toHaveBeenCalledTimes(1);
      expect(result).toEqual(stats);
    });

    it('Should throw EntityStatisticsNotFoundError when the entity is not registered', async () => {
      await expect(service.getStatistics('monsters')).rejects.toThrow(
        EntityStatisticsNotFoundError
      );
      await expect(service.getStatistics('monsters')).rejects.toThrow(
        'monsters statistics not found'
      );
    });
  });

  describe('getStatistic', () => {
    it('Should return a single statistic for the given entity', async () => {
      mockQuestStatistics.getStatistic.mockResolvedValue(1250.5);

      const result = await service.getStatistic('quests', 'averageReward');

      expect(mockQuestStatistics.getStatistic).toHaveBeenCalledWith('averageReward');
      expect(result).toBe(1250.5);
    });

    it('Should throw EntityStatisticsNotFoundError when the entity is not registered', async () => {
      await expect(service.getStatistic('monsters', 'count')).rejects.toThrow(
        EntityStatisticsNotFoundError
      );
    });
  });

  describe('getGlobalStatistic', () => {
    it('Should aggregate the statistic across every registered entity', async () => {
      mockQuestStatistics.getStatistic.mockResolvedValue(10);
      mockHunterStatistics.getStatistic.mockResolvedValue(5);

      const result = await service.getGlobalStatistic('count');

      expect(mockQuestStatistics.getStatistic).toHaveBeenCalledWith('count');
      expect(mockHunterStatistics.getStatistic).toHaveBeenCalledWith('count');
      expect(result).toEqual({ quests: 10, hunters: 5 });
    });

    it('Should omit entities where the statistic is not registered', async () => {
      mockQuestStatistics.getStatistic.mockResolvedValue(10);
      mockHunterStatistics.getStatistic.mockRejectedValue(
        new StatisticNotFoundError('count', 'hunters')
      );

      const result = await service.getGlobalStatistic('count');

      expect(result).toEqual({ quests: 10 });
    });

    it('Should throw GlobalStatisticNotFoundError when no entity has the statistic', async () => {
      mockQuestStatistics.getStatistic.mockRejectedValue(
        new StatisticNotFoundError('nonexistent', 'quests')
      );
      mockHunterStatistics.getStatistic.mockRejectedValue(
        new StatisticNotFoundError('nonexistent', 'hunters')
      );

      await expect(service.getGlobalStatistic('nonexistent')).rejects.toThrow(
        GlobalStatisticNotFoundError
      );
      await expect(service.getGlobalStatistic('nonexistent')).rejects.toThrow(
        "Statistic 'nonexistent' not found for any entity"
      );
    });
  });
});
