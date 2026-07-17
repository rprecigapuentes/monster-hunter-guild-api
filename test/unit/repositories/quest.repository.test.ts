import type { Prisma, Quest } from '../../../src/generated/prisma/client';
import { type PrismaModelDelegate } from '../../../src/repositories/interfaces/prisma-base-repository.abstract';
import { QuestRepository } from '../../../src/repositories/quest.repository';

describe('QuestRepository', () => {
  let repository: QuestRepository;
  let mockPrismaModel: jest.Mocked<
    PrismaModelDelegate<
      Quest,
      Prisma.QuestUncheckedCreateInput,
      Prisma.GuildUncheckedUpdateInput,
      Prisma.QuestWhereInput
    >
  >;

  beforeEach(() => {
    mockPrismaModel = {
      findMany: jest.fn(),
      aggregate: jest.fn(),
      count: jest.fn(),
    } as unknown as jest.Mocked<
      PrismaModelDelegate<
        Quest,
        Prisma.QuestUncheckedCreateInput,
        Prisma.GuildUncheckedUpdateInput,
        Prisma.QuestWhereInput
      >
    >;
    repository = new QuestRepository(mockPrismaModel);
  });

  describe('search', () => {
    it('should search by basic text fields (title and location)', async () => {
      mockPrismaModel.findMany.mockResolvedValue([]);

      const query = 'Forest';
      await repository.search(query);

      expect(mockPrismaModel.findMany).toHaveBeenCalledWith({
        where: {
          OR: [{ title: { contains: query } }, { location: { contains: query } }],
        },
      });
    });

    it('should resolve and append matched Enum values for QuestStatus', async () => {
      mockPrismaModel.findMany.mockResolvedValue([]);

      // 'pend' debería coincidir parcialmente con el enum 'PENDING'
      const query = 'pend';
      await repository.search(query);

      expect(mockPrismaModel.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { title: { contains: query } },
            { location: { contains: query } },
            { status: { in: ['PENDING'] } },
          ],
        },
      });
    });

    it('should append numeric reward search when query is a strict number', async () => {
      mockPrismaModel.findMany.mockResolvedValue([]);

      const query = '5000';
      await repository.search(query);

      expect(mockPrismaModel.findMany).toHaveBeenCalledWith({
        where: {
          OR: [{ title: { contains: query } }, { location: { contains: query } }, { reward: 5000 }],
        },
      });
    });
  });

  describe('averageReward', () => {
    it('Should return the average reward from the aggregate result', async () => {
      mockPrismaModel.aggregate.mockResolvedValue({ _avg: { reward: 875.25 } });

      const result = await repository.averageReward();

      expect(mockPrismaModel.aggregate).toHaveBeenCalledWith({ _avg: { reward: true } });
      expect(result).toBe(875.25);
    });

    it('Should return 0 when there are no quests to average', async () => {
      mockPrismaModel.aggregate.mockResolvedValue({ _avg: { reward: null } });

      const result = await repository.averageReward();

      expect(result).toBe(0);
    });
  });

  describe('countCompletedQuests', () => {
    it('Should call prisma.quest.count filtering by COMPLETED status', async () => {
      mockPrismaModel.count.mockResolvedValue(4);

      const result = await repository.countCompletedQuests();

      expect(mockPrismaModel.count).toHaveBeenCalledWith({ where: { status: 'COMPLETED' } });
      expect(result).toBe(4);
    });

    it('Should return 0 when there are no completed quests', async () => {
      mockPrismaModel.count.mockResolvedValue(0);

      const result = await repository.countCompletedQuests();

      expect(result).toBe(0);
    });
  });
});
