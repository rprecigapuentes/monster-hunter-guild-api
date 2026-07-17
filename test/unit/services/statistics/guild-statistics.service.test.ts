import { GuildStatisticsService } from '../../../../src/services/statistics/guild-statistics.service';
import { StatisticNotFoundError } from '../../../../src/services/statistics/base-statistics.service';
import type { ICountable } from '../../../../src/repositories/interfaces/countable.interface';

describe('GuildStatisticsService', () => {
  let service: GuildStatisticsService;
  let mockRepository: jest.Mocked<ICountable>;

  beforeEach(() => {
    mockRepository = {
      count: jest.fn(),
    } as unknown as jest.Mocked<ICountable>;

    service = new GuildStatisticsService(mockRepository);
  });

  it('Should expose "guilds" as its entity', () => {
    expect(service.entity).toBe('guilds');
  });

  describe('getStatistics', () => {
    it('Should return the count from the repository', async () => {
      mockRepository.count.mockResolvedValue(3);

      const result = await service.getStatistics();

      expect(mockRepository.count).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ count: 3 });
    });

    it('Should return zero when there are no guilds', async () => {
      mockRepository.count.mockResolvedValue(0);

      const result = await service.getStatistics();

      expect(result).toEqual({ count: 0 });
    });
  });

  describe('getStatistic', () => {
    it('Should return the count when requested by name', async () => {
      mockRepository.count.mockResolvedValue(3);

      const result = await service.getStatistic('count');

      expect(mockRepository.count).toHaveBeenCalledTimes(1);
      expect(result).toBe(3);
    });

    it('Should throw StatisticNotFoundError for a statistic that does not exist', async () => {
      await expect(service.getStatistic('nonexistent')).rejects.toThrow(StatisticNotFoundError);
      await expect(service.getStatistic('nonexistent')).rejects.toThrow(
        "Statistic 'nonexistent' not found for entity 'guilds'"
      );
      expect(mockRepository.count).not.toHaveBeenCalled();
    });
  });
});
