import { MonsterNotFoundError, MonsterService, MonsterValidationError } from './monster.service';

const mockCreate = jest.fn();
const mockUpdate = jest.fn();
const mockDelete = jest.fn();
const mockFindById = jest.fn();
const mockFindAll = jest.fn();

// 2. Pasamos estos mocks definidos a la implementación de la clase mockeada
jest.mock('../repositories/monster.repository', () => {
  return {
    MonsterRepository: jest.fn().mockImplementation(() => ({
      create: mockCreate,
      update: mockUpdate,
      delete: mockDelete,
      findById: mockFindById,
      findAll: mockFindAll,
    })),
  };
});

describe('MonsterService', () => {
  let service: MonsterService;

  const mockMonster = {
    id: 'm1',
    name: 'Thanatos',
    dangerLevel: 5,
    rewardValue: 1500,
    species: 'undead',
  };

  beforeEach(() => {
    jest.clearAllMocks();

    service = new MonsterService();
  });

  describe('create', () => {
    it('should create a monster when provided data is valid', async () => {
      const input = { name: 'Thanatos', dangerLevel: 5, rewardValue: 1500 };
      mockCreate.mockResolvedValue(mockMonster);

      const result = await service.create(input);

      expect(mockCreate).toHaveBeenCalledWith(input);
      expect(result).toEqual(mockMonster);
    });

    it('should throw MonsterValidationError if name is empty', async () => {
      const input = { name: '      ', dangerlevel: 5 };

      await expect(service.create(input)).rejects.toThrow(MonsterValidationError);
      await expect(service.create(input)).rejects.toThrow('Monster name is required');
      expect(mockCreate).not.toHaveBeenCalled();
    });

    it('should throw MonsterValidationError if dangerLevel is out of range', async () => {
      const inputLow = { name: 'Jagras', dangerLevel: 0 };
      const inputHigh = { name: 'Fatalis', dangerLevel: 11 };

      await expect(service.create(inputLow)).rejects.toThrow(
        'Monster danger level must be between 1 and 10'
      );
      await expect(service.create(inputHigh)).rejects.toThrow(
        'Monster danger level must be between 1 and 10'
      );
      expect(mockCreate).not.toHaveBeenCalled();
    });

    it('should trhow MonsterValidationError if dangerLevel is not a number', async () => {
      // eslint-disable-next-line
      const inputInvalid = { name: 'Anjanath', dangerLevel: 'high' as any };

      await expect(service.create(inputInvalid)).rejects.toThrow(
        'Monster danger level must be a precise number value'
      );
    });

    it('should create a monster even if rewardValue is 0', async () => {
      const input = { name: 'Rathian', dangerLevel: 4, rewardValue: 0, species: 'goblin' };
      const mockResult = {
        id: 'm-1',
        name: 'Ratia',
        dangerLevel: 4,
        rewardValue: 0,
        species: 'goblin',
      };

      mockCreate.mockResolvedValue(mockResult);

      const result = await service.create(input);

      expect(mockCreate).toHaveBeenCalledWith(input);
      expect(result).toEqual(mockResult);
    });

    it('should throw MonsterValidationError if rewardValue is lower than 0', async () => {
      const input = { name: 'Rathian', dangerLevel: 4, rewardValue: -32 };

      await expect(service.create(input)).rejects.toThrow(
        'Monster reward value must be greater or equal to 0'
      );
    });
  });

  describe('update', () => {
    const updateData = { name: 'Azure Rathalos' };

    it('should update a monster if it exists', async () => {
      mockFindById.mockResolvedValue(mockMonster);
      mockUpdate.mockResolvedValue({ ...mockMonster, ...updateData });

      const result = await service.update('m-1', updateData);

      expect(mockFindById).toHaveBeenCalledWith('m-1');
      expect(mockUpdate).toHaveBeenCalledWith('m-1', updateData);
      expect(result.name).toBe('Azure Rathalos');
    });

    it('should throw MonsterNotFoundError if monster does not exist', async () => {
      mockFindById.mockResolvedValue(null);

      await expect(service.update('invalid-id', updateData)).rejects.toThrow(MonsterNotFoundError);
      expect(mockUpdate).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete a monster successfully if it exists', async () => {
      mockFindById.mockResolvedValue(mockMonster);
      mockDelete.mockResolvedValue(true);

      const result = await service.delete('m-1');

      expect(mockDelete).toHaveBeenCalledWith('m-1');
      expect(result).toBe(true);
    });

    it('should throw MonsterNotFoundError if monster does not exist on delete', async () => {
      mockFindById.mockResolvedValue(null);

      await expect(service.delete('invalid-id')).rejects.toThrow(MonsterNotFoundError);
      expect(mockDelete).not.toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return the monster if found', async () => {
      mockFindById.mockResolvedValue(mockMonster);

      const result = await service.findById('m-1');

      expect(result).toEqual(mockMonster);
    });

    it('should throw MonsterNotFoundError if not found', async () => {
      mockFindById.mockResolvedValue(null);

      await expect(service.findById('invalid-id')).rejects.toThrow(MonsterNotFoundError);
    });
  });

  describe('findAll', () => {
    it('should return an array of monsters', async () => {
      const mockList = [mockMonster];
      mockFindAll.mockResolvedValue(mockList);

      const result = await service.findAll();

      expect(mockFindAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockList);
    });
  });
});
