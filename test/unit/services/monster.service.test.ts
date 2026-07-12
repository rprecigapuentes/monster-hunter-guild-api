import { type MonsterRepository } from '../../../src/repositories/monster.repository';
import { MonsterNotFoundError, MonsterService, MonsterValidationError } from '../../../src/services/monster.service';

describe('MonsterService', () => {
  let service: MonsterService;
  let mockRepository: jest.Mocked<MonsterRepository>;

  const mockMonster = {
    id: 'm1',
    name: 'Thanatos',
    dangerLevel: 5,
    rewardValue: 1500,
    species: 'undead',
  };

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
    } as unknown as jest.Mocked<MonsterRepository>;

    service = new MonsterService(mockRepository);
  });

  describe('create', () => {
    it('should create a monster when provided data is valid', async () => {
      const input = { name: 'Thanatos', dangerLevel: 5, rewardValue: 1500 };
      mockRepository.create.mockResolvedValue(mockMonster);

      const result = await service.create(input);

      expect(mockRepository.create).toHaveBeenCalledWith(input);
      expect(result).toEqual(mockMonster);
    });

    it('should throw MonsterValidationError if name is empty', async () => {
      const input = { name: '      ', dangerlevel: 5 };

      await expect(service.create(input)).rejects.toThrow(MonsterValidationError);
      await expect(service.create(input)).rejects.toThrow('Monster name is required');
      expect(mockRepository.create).not.toHaveBeenCalled();
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
      expect(mockRepository.create).not.toHaveBeenCalled();
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

      mockRepository.create.mockResolvedValue(mockResult);

      const result = await service.create(input);

      expect(mockRepository.create).toHaveBeenCalledWith(input);
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
      mockRepository.findById.mockResolvedValue(mockMonster);
      mockRepository.update.mockResolvedValue({ ...mockMonster, ...updateData });

      const result = await service.update('m-1', updateData);

      expect(mockRepository.findById).toHaveBeenCalledWith('m-1');
      expect(mockRepository.update).toHaveBeenCalledWith('m-1', updateData);
      expect(result.name).toBe('Azure Rathalos');
    });

    it('should throw MonsterNotFoundError if monster does not exist', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.update('invalid-id', updateData)).rejects.toThrow(MonsterNotFoundError);
      expect(mockRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete a monster successfully if it exists', async () => {
      mockRepository.findById.mockResolvedValue(mockMonster);
      mockRepository.delete.mockResolvedValue(true);

      const result = await service.delete('m-1');

      expect(mockRepository.delete).toHaveBeenCalledWith('m-1');
      expect(result).toBe(true);
    });

    it('should throw MonsterNotFoundError if monster does not exist on delete', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.delete('invalid-id')).rejects.toThrow(MonsterNotFoundError);
      expect(mockRepository.delete).not.toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return the monster if found', async () => {
      mockRepository.findById.mockResolvedValue(mockMonster);

      const result = await service.findById('m-1');

      expect(result).toEqual(mockMonster);
    });

    it('should throw MonsterNotFoundError if not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.findById('invalid-id')).rejects.toThrow(MonsterNotFoundError);
    });
  });

  describe('findAll', () => {
    it('should return an array of monsters', async () => {
      const mockList = [mockMonster];
      mockRepository.findAll.mockResolvedValue(mockList);

      const result = await service.findAll();

      expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockList);
    });
  });

  describe('exist', () => {
    it('should return exists === true when monster exists', async () => {
      mockRepository.findById.mockResolvedValue(mockMonster);

      const result = await service.exists('m1');

      expect(mockRepository.findById).toHaveBeenCalledWith('m1');
      expect(result).toBe(true);
    });

    it('should return exists === null when monster does not exists', async () => {
      mockRepository.findById.mockResolvedValue(null);

      const result = await service.exists('m1');

      expect(mockRepository.findById).toHaveBeenCalledWith('m1');
      expect(result).toEqual(false);
    });
  });
});
