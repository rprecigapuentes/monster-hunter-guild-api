import { PrismaBaseRepository } from '../../../src/repositories/interfaces/prisma-base-repository.abstract';
import { prisma } from '../../../src/lib/prisma';
import { Prisma } from '../../../src/generated/prisma/client';

jest.mock('../../../src/lib/prisma', () => ({
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
  region: string | null;
  headquarters: string | null;
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

class TestGuildRepository extends PrismaBaseRepository<
  MockModel,
  MockCreateInput,
  MockUpdateInput
> {
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
      const id = 'non-existent-id';
      const prismaError = new Prisma.PrismaClientKnownRequestError(
        'Record to delete does not exist.',
        {
          code: 'P2025',
          clientVersion: '5.0.0', // <-- dummy
        }
      );

      mockGuildModel.delete.mockRejectedValue(prismaError);

      const result = await repository.delete(id);

      expect(mockGuildModel.delete).toHaveBeenCalledWith({ where: { id } });
      expect(result).toBe(false);
    });
  });

  describe('findById', () => {
    it('should return by ID', async () => {
      const id = '1';
      const mockResult = { id: '1', name: 'Ravagers', region: 'east', headquarters: 'london' };

      mockGuildModel.findUnique.mockResolvedValue(mockResult);

      const result = await repository.findById(id);

      expect(mockGuildModel.findUnique).toHaveBeenCalledWith({ where: { id } });
      expect(result).toEqual(mockResult);
    });
  });

  describe('findAll', () => {
    it('should return ALL records of the table', async () => {
      const mockList = [
        { id: '1', name: 'Ravagers', region: 'east', headquarters: 'london' },
        { id: '2', name: 'Devs', region: 'east', headquarters: 'japan' },
        { id: '3', name: 'Blindeads', region: 'west', headquarters: "old man's risk" },
      ];

      mockGuildModel.findMany.mockResolvedValue(mockList);

      const result = await repository.findAll();

      expect(mockGuildModel.findMany).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockList);
    });
  });
});
