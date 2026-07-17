import { MonsterRepository } from '../../../src/repositories/monster.repository';

describe('MonsterRepository', () => {
  let repository: MonsterRepository;
  let mockPrismaModel: any;

  beforeEach(() => {
    mockPrismaModel = {
      findMany: jest.fn(),
    };
    repository = new MonsterRepository(mockPrismaModel);
  });

  describe('search', () => {
    it('should search by text fields only when query is NOT a number', async () => {
      mockPrismaModel.findMany.mockResolvedValue([]);

      const query = 'Rath';
      await repository.search(query);

      expect(mockPrismaModel.findMany).toHaveBeenCalledWith({
        where: {
          OR: [{ name: { contains: query } }, { species: { contains: query } }],
        },
      });
    });

    it('should append numeric conditions when query is a strict number', async () => {
      mockPrismaModel.findMany.mockResolvedValue([]);

      const query = '5';
      await repository.search(query);

      expect(mockPrismaModel.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { name: { contains: query } },
            { species: { contains: query } },
            { dangerLevel: 5 },
            { rewardValue: 5 },
          ],
        },
      });
    });
  });
});
