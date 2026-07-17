import { QuestRepository } from '../../../src/repositories/quest.repository';

describe('QuestRepository', () => {
  let repository: QuestRepository;
  let mockPrismaModel: any;

  beforeEach(() => {
    mockPrismaModel = {
      findMany: jest.fn(),
    };
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
});
