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
});
