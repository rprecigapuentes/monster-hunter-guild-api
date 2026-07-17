import { HunterRepository } from '../../../src/repositories/hunter.repository';

describe('HunterRepository', () => {
  let repository: HunterRepository;
  let mockPrismaModel: any;
  const mockHunters = [
    { id: '1', name: 'Aiden', rank: 2, experiencePoints: 2000, guildId: 'g1' },
    { id: '2', name: 'Rin', rank: 2, experiencePoints: 1500, guildId: 'g2' },
    { id: '3', name: 'Toma', rank: 3, experiencePoints: 3100, guildId: 'g1' },
  ];

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

  describe('hunterLeaderboard', () => {
    it('Should call prisma.hunter.findMany ordered by rank and experience points descending', async () => {
      mockPrismaModel.findMany.mockResolvedValue(mockHunters as never);

      const result = await repository.hunterLeaderboard();

      expect(mockPrismaModel.findMany).toHaveBeenCalledWith({
        orderBy: [{ rank: 'desc' }, { experiencePoints: 'desc' }],
      });
      expect(result).toEqual(mockHunters);
    });

    it('Should return an empty array when there are no hunters', async () => {
      mockPrismaModel.findMany.mockResolvedValue([]);

      const result = await repository.hunterLeaderboard();

      expect(result).toEqual([]);
    });
  });
});
