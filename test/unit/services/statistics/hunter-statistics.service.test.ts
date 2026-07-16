import { HunterStatisticsService } from '../../../../src/services/statistics/hunter-statistics.service';
import { StatisticNotFoundError } from '../../../../src/services/statistics/base-statistics.service';
import type { IHunterRepository } from '../../../../src/repositories/interfaces/hunter-repository.interface';

describe('HunterStatisticsService', () => {
  let service: HunterStatisticsService;
  let mockRepository: jest.Mocked<IHunterRepository>;

  const mockHunters = [
    { id: '1', name: 'Aiden', rank: 5, experiencePoints: 5000, guildId: 'g1' },
    { id: '2', name: 'Rin', rank: 3, experiencePoints: 1500, guildId: 'g2' },
  ];

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      count: jest.fn(),
      hunterLeaderboard: jest.fn(),
    } as unknown as jest.Mocked<IHunterRepository>;

    service = new HunterStatisticsService(mockRepository);
  });

  it('Should expose "hunters" as its entity', () => {
    expect(service.entity).toBe('hunters');
  });

  describe('getStatistics', () => {
    it('Should return count and leaderboard from the repository', async () => {
      mockRepository.count.mockResolvedValue(5);
      mockRepository.hunterLeaderboard.mockResolvedValue(mockHunters as never);

      const result = await service.getStatistics();

      expect(mockRepository.count).toHaveBeenCalledTimes(1);
      expect(mockRepository.hunterLeaderboard).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ count: 5, leaderboard: mockHunters });
    });

    it('Should return zero count and empty leaderboard when there are no hunters', async () => {
      mockRepository.count.mockResolvedValue(0);
      mockRepository.hunterLeaderboard.mockResolvedValue([]);

      const result = await service.getStatistics();

      expect(result).toEqual({ count: 0, leaderboard: [] });
    });
  });

  describe('getStatistic', () => {
    it('Should return the count when requested by name', async () => {
      mockRepository.count.mockResolvedValue(5);

      const result = await service.getStatistic('count');

      expect(mockRepository.count).toHaveBeenCalledTimes(1);
      expect(result).toBe(5);
    });

    it('Should return the leaderboard when requested by name', async () => {
      mockRepository.hunterLeaderboard.mockResolvedValue(mockHunters as never);

      const result = await service.getStatistic('leaderboard');

      expect(mockRepository.hunterLeaderboard).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockHunters);
    });

    it('Should throw StatisticNotFoundError for a statistic that does not exist', async () => {
      await expect(service.getStatistic('nonexistent')).rejects.toThrow(StatisticNotFoundError);
      await expect(service.getStatistic('nonexistent')).rejects.toThrow(
        "Statistic 'nonexistent' not found for entity 'hunters'"
      );
      expect(mockRepository.count).not.toHaveBeenCalled();
      expect(mockRepository.hunterLeaderboard).not.toHaveBeenCalled();
    });
  });
});
