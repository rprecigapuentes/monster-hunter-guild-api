import { MonsterStatisticsService } from '../../../../src/services/statistics/monster-statistics.service';
import { StatisticNotFoundError } from '../../../../src/services/statistics/base-statistics.service';
import type { ICountable } from '../../../../src/repositories/interfaces/countable.interface';

describe('MonsterStatisticsService', () => {
  let service: MonsterStatisticsService;
  let mockRepository: jest.Mocked<ICountable>;

  beforeEach(() => {
    mockRepository = {
      count: jest.fn(),
    } as unknown as jest.Mocked<ICountable>;

    service = new MonsterStatisticsService(mockRepository);
  });

  it('Should expose "monsters" as its entity', () => {
    expect(service.entity).toBe('monsters');
  });

  describe('getStatistics', () => {
    it('Should return the count from the repository', async () => {
      mockRepository.count.mockResolvedValue(8);

      const result = await service.getStatistics();

      expect(mockRepository.count).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ count: 8 });
    });

    it('Should return zero when there are no monsters', async () => {
      mockRepository.count.mockResolvedValue(0);

      const result = await service.getStatistics();

      expect(result).toEqual({ count: 0 });
    });
  });

  describe('getStatistic', () => {
    it('Should return the count when requested by name', async () => {
      mockRepository.count.mockResolvedValue(8);

      const result = await service.getStatistic('count');

      expect(mockRepository.count).toHaveBeenCalledTimes(1);
      expect(result).toBe(8);
    });

    it('Should throw StatisticNotFoundError for a statistic that does not exist', async () => {
      await expect(service.getStatistic('nonexistent')).rejects.toThrow(StatisticNotFoundError);
      await expect(service.getStatistic('nonexistent')).rejects.toThrow(
        "Statistic 'nonexistent' not found for entity 'monsters'"
      );
      expect(mockRepository.count).not.toHaveBeenCalled();
    });
  });
});
