import { type Guild } from '../../../src/generated/zod';
import { GuildRepository } from '../../../src/repositories/guild.repository';

describe('GuildRepository', () => {
  let repository: GuildRepository;
  let mockPrismaModel: any;

  beforeEach(() => {
    mockPrismaModel = {
      findMany: jest.fn(),
    };
    repository = new GuildRepository(mockPrismaModel);
  });

  describe('search', () => {
    it('should query prisma with text fields in OR condition', async () => {
      const mockResult: Guild[] = [
        { id: '1', name: 'Silver Wing Alliance', region: 'Ancient Forest', headquarters: 'Astera' },
      ];
      mockPrismaModel.findMany.mockResolvedValue(mockResult);

      const query = 'Silver';
      const result = await repository.search(query);

      expect(mockPrismaModel.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { name: { contains: query } },
            { region: { contains: query } },
            { headquarters: { contains: query } },
          ],
        },
      });
      expect(result).toEqual(mockResult);
    });
  });
});
