import { QuestStatisticsService } from '../../../../src/services/statistics/quest-statistics.service';
import { StatisticNotFoundError } from '../../../../src/services/statistics/base-statistics.service';
import type { IQuestRepository } from '../../../../src/repositories/interfaces/quest-repository.interface';

describe('QuestStatisticsService', () => {
  let service: QuestStatisticsService;
  let mockRepository: jest.Mocked<IQuestRepository>;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      count: jest.fn(),
      averageReward: jest.fn(),
      countCompletedQuests: jest.fn(),
    } as unknown as jest.Mocked<IQuestRepository>;

    service = new QuestStatisticsService(mockRepository);
  });

  it('Should expose "quests" as its entity', () => {
    expect(service.entity).toBe('quests');
  });

  describe('getStatistics', () => {
    it('Should return count, averageReward and completed from the repository', async () => {
      mockRepository.count.mockResolvedValue(10);
      mockRepository.averageReward.mockResolvedValue(1250.5);
      mockRepository.countCompletedQuests.mockResolvedValue(7);

      const result = await service.getStatistics();

      expect(mockRepository.count).toHaveBeenCalledTimes(1);
      expect(mockRepository.averageReward).toHaveBeenCalledTimes(1);
      expect(mockRepository.countCompletedQuests).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ count: 10, averageReward: 1250.5, completed: 7 });
    });

    it('Should return zeroes when there are no quests', async () => {
      mockRepository.count.mockResolvedValue(0);
      mockRepository.averageReward.mockResolvedValue(0);
      mockRepository.countCompletedQuests.mockResolvedValue(0);

      const result = await service.getStatistics();

      expect(result).toEqual({ count: 0, averageReward: 0, completed: 0 });
    });
  });

  describe('getStatistic', () => {
    it('Should return the count when requested by name', async () => {
      mockRepository.count.mockResolvedValue(10);

      const result = await service.getStatistic('count');

      expect(mockRepository.count).toHaveBeenCalledTimes(1);
      expect(result).toBe(10);
    });

    it('Should return the averageReward when requested by name', async () => {
      mockRepository.averageReward.mockResolvedValue(1250.5);

      const result = await service.getStatistic('averageReward');

      expect(mockRepository.averageReward).toHaveBeenCalledTimes(1);
      expect(result).toBe(1250.5);
    });

    it('Should return the completed count when requested by name', async () => {
      mockRepository.countCompletedQuests.mockResolvedValue(7);

      const result = await service.getStatistic('completed');

      expect(mockRepository.countCompletedQuests).toHaveBeenCalledTimes(1);
      expect(result).toBe(7);
    });

    it('Should throw StatisticNotFoundError for a statistic that does not exist', async () => {
      await expect(service.getStatistic('nonexistent')).rejects.toThrow(StatisticNotFoundError);
      await expect(service.getStatistic('nonexistent')).rejects.toThrow(
        "Statistic 'nonexistent' not found for entity 'quests'"
      );
      expect(mockRepository.count).not.toHaveBeenCalled();
      expect(mockRepository.averageReward).not.toHaveBeenCalled();
      expect(mockRepository.countCompletedQuests).not.toHaveBeenCalled();
    });
  });
});
