import { HunterRepository } from '../../../src/repositories/hunter.repository';

describe('HunterRepository', () => {
  let repository: HunterRepository;
  let mockPrismaModel: any;

  beforeEach(() => {
    mockPrismaModel = {
      findMany: jest.fn(),
    };
    repository = new HunterRepository(mockPrismaModel);
  });

  describe('search', () => {
    it('should search by name when query is NOT a number', async () => {
      mockPrismaModel.findMany.mockResolvedValue([]);

      const query = 'Aiden';
      await repository.search(query);

      expect(mockPrismaModel.findMany).toHaveBeenCalledWith({
        where: {
          OR: [{ name: { contains: query } }],
        },
      });
    });

    it('should append numeric conditions for rank and experiencePoints', async () => {
      mockPrismaModel.findMany.mockResolvedValue([]);

      const query = '12';
      await repository.search(query);

      expect(mockPrismaModel.findMany).toHaveBeenCalledWith({
        where: {
          OR: [{ name: { contains: query } }, { rank: 12 }, { experiencePoints: 12 }],
        },
      });
    });
  });
});
