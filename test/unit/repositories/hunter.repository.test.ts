import { HunterRepository } from '../../../src/repositories/hunter.repository';
import type { PrismaModelDelegate } from '../../../src/repositories/interfaces/prisma-base-repository.abstract';
import type { Hunter, Prisma } from '../../../src/generated/prisma/client';

describe('HunterRepository', () => {
  let repository: HunterRepository;
  let mockHunterModel: jest.Mocked<
    PrismaModelDelegate<
      Hunter,
      Prisma.HunterUncheckedCreateInput,
      Prisma.HunterUncheckedUpdateInput
    >
  >;

  const mockHunters = [
    { id: '1', name: 'Aiden', rank: 2, experiencePoints: 2000, guildId: 'g1' },
    { id: '2', name: 'Rin', rank: 2, experiencePoints: 1500, guildId: 'g2' },
    { id: '3', name: 'Toma', rank: 3, experiencePoints: 3100, guildId: 'g1' },
  ];

  beforeEach(() => {
    mockHunterModel = {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    } as unknown as jest.Mocked<
      PrismaModelDelegate<
        Hunter,
        Prisma.HunterUncheckedCreateInput,
        Prisma.HunterUncheckedUpdateInput
      >
    >;

    repository = new HunterRepository(mockHunterModel);
  });

  describe('hunterLeaderboard', () => {
    it('Should call prisma.hunter.findMany ordered by rank and experience points descending', async () => {
      mockHunterModel.findMany.mockResolvedValue(mockHunters as never);

      const result = await repository.hunterLeaderboard();

      expect(mockHunterModel.findMany).toHaveBeenCalledWith({
        orderBy: [{ rank: 'desc' }, { experiencePoints: 'desc' }],
      });
      expect(result).toEqual(mockHunters);
    });

    it('Should return an empty array when there are no hunters', async () => {
      mockHunterModel.findMany.mockResolvedValue([]);

      const result = await repository.hunterLeaderboard();

      expect(result).toEqual([]);
    });
  });
});
