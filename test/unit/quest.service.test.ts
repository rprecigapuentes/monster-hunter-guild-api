import {
  QuestService,
  QuestNotFoundError,
  QuestValidationError,
} from '../../src/services/quest.service';
import type { QuestRepository } from '../../src/repositories/quest.repository';
import type { MonsterRepository } from '../../src/repositories/monster.repository';
import type { Monster, Quest } from '../../src/generated/prisma/client';

describe('QuestService', () => {
  let service: QuestService;
  let mockQuestRepository: jest.Mocked<QuestRepository>;
  let mockMonsterRepository: jest.Mocked<MonsterRepository>;

  const mockQuest: Quest = {
    id: '1',
    title: 'Hunt the Rathalos',
    location: 'Ancient Forest',
    reward: 5000,
    status: 'OPEN',
    monsterId: 'm1',
  };

  const mockMonster: Monster = {
    id: 'm1',
    name: 'Rathalos',
    species: 'Flying Wyvern',
    dangerLevel: 7,
    rewardValue: 5000,
  };

  beforeEach(() => {
    mockQuestRepository = {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
    } as unknown as jest.Mocked<QuestRepository>;

    mockMonsterRepository = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<MonsterRepository>;

    service = new QuestService(mockQuestRepository, mockMonsterRepository);
  });

  describe('Create Quest', () => {
    const input = {
      title: 'Hunt the Rathalos',
      monsterId: 'm1',
      location: 'Ancient Forest',
      reward: 5000,
      status: 'OPEN',
    };

    it('Should create a new quest when data is valid', async () => {
      mockMonsterRepository.findById.mockResolvedValue(mockMonster);
      mockQuestRepository.create.mockResolvedValue(mockQuest);

      const result = await service.create(input);

      expect(mockMonsterRepository.findById).toHaveBeenCalledWith('m1');
      expect(mockQuestRepository.create).toHaveBeenCalledWith(input);
      expect(result).toEqual(mockQuest);
    });

    it('Should throw validation error when title is empty', async () => {
      await expect(service.create({ ...input, title: '   ' })).rejects.toThrow(QuestValidationError);
      expect(mockQuestRepository.create).not.toHaveBeenCalled();
    });

    it('Should throw validation error when reward is negative', async () => {
      await expect(service.create({ ...input, reward: -1 })).rejects.toThrow(QuestValidationError);
      expect(mockQuestRepository.create).not.toHaveBeenCalled();
    });

    it('Should throw validation error when the monster does not exist', async () => {
      mockMonsterRepository.findById.mockResolvedValue(null);

      await expect(service.create({ ...input, monsterId: 'ghost' })).rejects.toThrow(
        QuestValidationError
      );
      expect(mockMonsterRepository.findById).toHaveBeenCalledWith('ghost');
      expect(mockQuestRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('Update Quest', () => {
    it('Should update an existing quest', async () => {
      const updateData = { title: 'Updated title', reward: 9000 };
      const updatedQuest = { ...mockQuest, ...updateData };
      mockQuestRepository.findById.mockResolvedValue(mockQuest);
      mockQuestRepository.update.mockResolvedValue(updatedQuest);

      const result = await service.update('1', updateData);

      expect(mockQuestRepository.findById).toHaveBeenCalledWith('1');
      expect(mockQuestRepository.update).toHaveBeenCalledWith('1', updateData);
      expect(result).toEqual(updatedQuest);
    });

    it('Should throw when the quest does not exist', async () => {
      mockQuestRepository.findById.mockResolvedValue(null);

      await expect(service.update('999', { title: 'x' })).rejects.toThrow(QuestNotFoundError);
      expect(mockQuestRepository.update).not.toHaveBeenCalled();
    });

    it('Should throw validation error when reward is negative', async () => {
      mockQuestRepository.findById.mockResolvedValue(mockQuest);

      await expect(service.update('1', { reward: -5 })).rejects.toThrow(QuestValidationError);
      expect(mockQuestRepository.update).not.toHaveBeenCalled();
    });

    it('Should throw validation error when the new monster does not exist', async () => {
      mockQuestRepository.findById.mockResolvedValue(mockQuest);
      mockMonsterRepository.findById.mockResolvedValue(null);

      await expect(service.update('1', { monsterId: 'ghost' })).rejects.toThrow(QuestValidationError);
      expect(mockMonsterRepository.findById).toHaveBeenCalledWith('ghost');
      expect(mockQuestRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('Delete Quest', () => {
    it('Should delete an existing quest', async () => {
      mockQuestRepository.findById.mockResolvedValue(mockQuest);
      mockQuestRepository.delete.mockResolvedValue(true);

      const result = await service.delete('1');

      expect(mockQuestRepository.findById).toHaveBeenCalledWith('1');
      expect(mockQuestRepository.delete).toHaveBeenCalledWith('1');
      expect(result).toBe(true);
    });

    it('Should throw when the quest does not exist', async () => {
      mockQuestRepository.findById.mockResolvedValue(null);

      await expect(service.delete('999')).rejects.toThrow(QuestNotFoundError);
      expect(mockQuestRepository.delete).not.toHaveBeenCalled();
    });
  });

  describe('Find Quest by ID', () => {
    it('Should return the quest when it exists', async () => {
      mockQuestRepository.findById.mockResolvedValue(mockQuest);

      const result = await service.findById('1');

      expect(mockQuestRepository.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockQuest);
    });

    it('Should throw when the quest does not exist', async () => {
      mockQuestRepository.findById.mockResolvedValue(null);

      await expect(service.findById('999')).rejects.toThrow(QuestNotFoundError);
    });
  });

  describe('findAll', () => {
    it('Should return all quests', async () => {
      const quests = [mockQuest, { ...mockQuest, id: '2', title: 'Slay the Nergigante' }];
      mockQuestRepository.findAll.mockResolvedValue(quests);

      const result = await service.findAll();

      expect(mockQuestRepository.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(quests);
    });
  });
});
