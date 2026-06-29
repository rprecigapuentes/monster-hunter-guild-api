import { PrismaRepository } from './prisma-repository.abstract';
import { prisma } from '../../lib/prisma';

jest.mock('../../lib/prisma', () => ({
  prisma: {
    guild: {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
  },
}));

interface MockModel {
  id: string;
  name: string;
  region: string;
  headquarters: string;
}

interface MockCreateInput {
  name: string;
  region: string;
  headquarters: string;
}

interface MockUpdateInput {
  name?: string;
  region?: string;
  headquarters?: string;
}

class TestGuildRepository extends PrismaRepository<MockModel, MockCreateInput, MockUpdateInput> {
  constructor() {
    super(prisma.guild);
  }
}

describe('PrismaRepository', () => {
  let repository: TestGuildRepository;

  const mockGuildModel = prisma.guild as jest.Mocked<typeof prisma.guild>;

  beforeEach(() => {
    jest.clearAllMocks();

    repository = new TestGuildRepository();
  });

  describe('create', () => {
    it('should call prisma.guild.create with correct data', async () => {
      const mockInput = { name: 'Ravagers', headquarters: 'Princeton', region: 'south' };
      const mockResult = { id: '1', name: 'Ravagers', headquarters: 'Princeton', region: 'south' };

      mockGuildModel.create.mockResolvedValue(mockResult);

      const result = await repository.create(mockInput);

      console.log(result);

      expect(mockGuildModel.create).toHaveBeenCalledWith({ data: mockInput });
      expect(result).toEqual(mockResult);
    });
  });

  describe('update', () => {
    it('should call prisma.guild.update with given id 1 and correct data', async () => {
      const id = '1';
      const mockUpdateData = { name: 'Devs' };
      const mockResult = { id: '1', name: 'Devs', headquarters: 'Kingshot', region: 'west' };

      mockGuildModel.update.mockResolvedValue(mockResult);

      const result = await repository.update(id, mockUpdateData);

      expect(mockGuildModel.update).toHaveBeenCalledWith({
        where: { id },
        data: mockUpdateData,
      });
      expect(result).toEqual(mockResult);
    });
  });

  describe('delete', () => {
    it('should return true if deleted item', async () => {
      const id = '3';
      const mockResult = { id: '3', name: 'Drakes', headquarters: 'Abiss Crags', region: 'south' };

      mockGuildModel.delete.mockResolvedValue(mockResult);

      const result = await repository.delete(id);

      expect(mockGuildModel.delete).toHaveBeenCalledWith({ where: { id } });
      expect(result).toBe(true);
    });

    it('should return false if item not found', async () => {
      const id = '7';
      const mockResult = { id: '3', name: 'Drakes', headquarters: 'Abiss Crags', region: 'south' };

      mockGuildModel.delete.mockRejectedValue(new Error('Record to delete does not exist.'));

      const result = await repository.delete(id);
      expect(result).toBe(false);
    });
  });
});
