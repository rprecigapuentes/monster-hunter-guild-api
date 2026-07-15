import { QuestRepository } from '../../../src/repositories/quest.repository';
import type { PrismaModelDelegate } from '../../../src/repositories/interfaces/prisma-base-repository.abstract';
import type { Prisma, Quest } from '../../../src/generated/prisma/client';

describe('QuestRepository', () => {
  let repository: QuestRepository;
  let mockQuestModel: jest.Mocked<
    PrismaModelDelegate<Quest, Prisma.QuestUncheckedCreateInput, Prisma.QuestUncheckedUpdateInput>
  >;

  beforeEach(() => {
    mockQuestModel = {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      aggregate: jest.fn(),
    } as unknown as jest.Mocked<
      PrismaModelDelegate<Quest, Prisma.QuestUncheckedCreateInput, Prisma.QuestUncheckedUpdateInput>
    >;

    repository = new QuestRepository(mockQuestModel);
  });

  describe('averageReward', () => {
    it('Should return the average reward from the aggregate result', async () => {
      mockQuestModel.aggregate.mockResolvedValue({ _avg: { reward: 875.25 } });

      const result = await repository.averageReward();

      expect(mockQuestModel.aggregate).toHaveBeenCalledWith({ _avg: { reward: true } });
      expect(result).toBe(875.25);
    });

    it('Should return 0 when there are no quests to average', async () => {
      mockQuestModel.aggregate.mockResolvedValue({ _avg: { reward: null } });

      const result = await repository.averageReward();

      expect(result).toBe(0);
    });
  });

  describe('countCompletedQuests', () => {
    it('Should call prisma.quest.count filtering by COMPLETED status', async () => {
      mockQuestModel.count.mockResolvedValue(4);

      const result = await repository.countCompletedQuests();

      expect(mockQuestModel.count).toHaveBeenCalledWith({ where: { status: 'COMPLETED' } });
      expect(result).toBe(4);
    });

    it('Should return 0 when there are no completed quests', async () => {
      mockQuestModel.count.mockResolvedValue(0);

      const result = await repository.countCompletedQuests();

      expect(result).toBe(0);
    });
  });
});
