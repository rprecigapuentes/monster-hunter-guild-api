import { StatisticsService } from '../../../src/services/statistics.service';
import type { IQuestRepository } from '../../../src/repositories/interfaces/quest-repository.interface';
import type { IHunterRepository } from '../../../src/repositories/interfaces/hunter-repository.interface';
import type { ICountable } from '../../../src/repositories/interfaces/countable.interface';

describe('StatisticsService', () => {
  let service: StatisticsService;
  let mockQuestRepository: jest.Mocked<IQuestRepository>;
  let mockHunterRepository: jest.Mocked<IHunterRepository>;
  let mockGuildRepository: jest.Mocked<ICountable>;
  let mockMonsterRepository: jest.Mocked<ICountable>;

  const mockHunters = [
    { id: '1', name: 'Aiden', rank: 5, experiencePoints: 5000, guildId: 'g1' },
    { id: '2', name: 'Rin', rank: 3, experiencePoints: 1500, guildId: 'g2' },
  ];

  beforeEach(() => {
    mockQuestRepository = {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      count: jest.fn(),
      averageReward: jest.fn(),
      countCompletedQuests: jest.fn(),
    } as unknown as jest.Mocked<IQuestRepository>;

    mockHunterRepository = {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      count: jest.fn(),
      hunterLeaderboard: jest.fn(),
    } as unknown as jest.Mocked<IHunterRepository>;

    mockGuildRepository = {
      count: jest.fn(),
    } as unknown as jest.Mocked<ICountable>;

    mockMonsterRepository = {
      count: jest.fn(),
    } as unknown as jest.Mocked<ICountable>;

    service = new StatisticsService({
      questRepository: mockQuestRepository,
      hunterRepository: mockHunterRepository,
      guildRepository: mockGuildRepository,
      monsterRepository: mockMonsterRepository,
    });
  });

  describe('getQuestAverageReward', () => {
    it('Should return the average reward from the quest repository', async () => {
      mockQuestRepository.averageReward.mockResolvedValue(1250.5);

      const result = await service.getQuestAverageReward();

      expect(mockQuestRepository.averageReward).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ averageReward: 1250.5 });
    });

    it('Should return zero when there are no quests', async () => {
      mockQuestRepository.averageReward.mockResolvedValue(0);

      const result = await service.getQuestAverageReward();

      expect(result).toEqual({ averageReward: 0 });
    });
  });

  describe('getEntitiesCount', () => {
    it('Should return the count of every entity', async () => {
      mockQuestRepository.count.mockResolvedValue(10);
      mockHunterRepository.count.mockResolvedValue(5);
      mockGuildRepository.count.mockResolvedValue(3);
      mockMonsterRepository.count.mockResolvedValue(8);

      const result = await service.getEntitiesCount();

      expect(mockQuestRepository.count).toHaveBeenCalledTimes(1);
      expect(mockHunterRepository.count).toHaveBeenCalledTimes(1);
      expect(mockGuildRepository.count).toHaveBeenCalledTimes(1);
      expect(mockMonsterRepository.count).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ quests: 10, hunters: 5, guilds: 3, monsters: 8 });
    });
  });

  describe('getCompletedQuestsCount', () => {
    it('Should return the number of completed quests', async () => {
      mockQuestRepository.countCompletedQuests.mockResolvedValue(7);

      const result = await service.getCompletedQuestsCount();

      expect(mockQuestRepository.countCompletedQuests).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ completedQuests: 7 });
    });
  });

  describe('getHunterLeaderboard', () => {
    it('Should return the leaderboard mapped from the hunter repository', async () => {
      mockHunterRepository.hunterLeaderboard.mockResolvedValue(mockHunters as never);

      const result = await service.getHunterLeaderboard();

      expect(mockHunterRepository.hunterLeaderboard).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        leaderboard: [
          { id: '1', name: 'Aiden', rank: 5, experiencePoints: 5000, guildId: 'g1' },
          { id: '2', name: 'Rin', rank: 3, experiencePoints: 1500, guildId: 'g2' },
        ],
      });
    });

    it('Should return an empty leaderboard when there are no hunters', async () => {
      mockHunterRepository.hunterLeaderboard.mockResolvedValue([]);

      const result = await service.getHunterLeaderboard();

      expect(result).toEqual({ leaderboard: [] });
    });
  });
});
