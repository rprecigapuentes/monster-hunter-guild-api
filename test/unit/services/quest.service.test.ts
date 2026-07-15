import {
  QuestService,
  QuestNotFoundError,
  QuestValidationError,
} from '../../../src/services/quest.service';
import type { QuestRepository } from '../../../src/repositories/quest.repository';
import type { Quest, QuestStatus } from '../../../src/generated/prisma/client';
import { type QuestUncheckedCreateInput } from '../../../src/generated/prisma/models';
import { EntityExistenceValidator } from '../../../src/services/entity-existence-validator';
import { RelatedEntityValidationError } from '../../../src/errors/related-entity-validation.error';
import { type QuestAssignmentService } from '../../../src/services/quest-assignment.service';
import { type RewardDistributionService } from '../../../src/services/reward-distribution.service';
import { EventManager } from '../../../src/events/event-manager';

describe('QuestService', () => {
  let service: QuestService;
  let mockQuestRepository: jest.Mocked<QuestRepository>;
  let mockMonsterExistence: jest.Mocked<EntityExistenceValidator>;
  let mockQuestAssignmentService: jest.Mocked<QuestAssignmentService>;
  let mockRewardDistributionService: jest.Mocked<RewardDistributionService>;
  let mockEvents: jest.Mocked<EventManager>;

  const mockQuest: Quest = {
    id: '1',
    title: 'Hunt the Rathalos',
    location: 'Ancient Forest',
    reward: 5000,
    status: 'PENDING',
    monsterId: 'm1',
  };

  beforeEach(() => {
    mockQuestRepository = {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
    } as unknown as jest.Mocked<QuestRepository>;

    mockMonsterExistence = {
      ensure: jest.fn(),
    } as unknown as jest.Mocked<EntityExistenceValidator>;

    mockEvents = {
      notify: jest.fn(),
    } as unknown as jest.Mocked<EventManager>;

    service = new QuestService({
      repository: mockQuestRepository,
      monsterExistence: mockMonsterExistence,
      events: mockEvents,
      getRewardDistributionService: () => mockRewardDistributionService,
      getQuestAssignmentService: () => mockQuestAssignmentService,
    });
    
    mockQuestAssignmentService = {
      findByQuest: jest.fn().mockResolvedValue([]),
    } as unknown as jest.Mocked<QuestAssignmentService>;

    mockRewardDistributionService = {
      distributeRewards: jest.fn(),
    } as unknown as jest.Mocked<RewardDistributionService>;
  });

  describe('Create Quest', () => {
    const input: QuestUncheckedCreateInput = {
      title: 'Hunt the Rathalos',
      monsterId: 'm1',
      location: 'Ancient Forest',
      reward: 5000,
      status: 'PENDING',
    };

    it('Should create a new quest when data is valid', async () => {
      mockMonsterExistence.ensure.mockResolvedValue(undefined);
      mockQuestRepository.create.mockResolvedValue(mockQuest);

      const result = await service.create(input);

      expect(mockMonsterExistence.ensure).toHaveBeenCalledWith('m1');
      expect(mockQuestRepository.create).toHaveBeenCalledWith(input);
      expect(result).toEqual(mockQuest);
    });

    it('Should throw validation error when title is empty', async () => {
      await expect(service.create({ ...input, title: '   ' })).rejects.toThrow(
        QuestValidationError
      );
      expect(mockQuestRepository.create).not.toHaveBeenCalled();
    });

    it('Should throw validation error when reward is negative', async () => {
      await expect(service.create({ ...input, reward: -1 })).rejects.toThrow(QuestValidationError);
      expect(mockQuestRepository.create).not.toHaveBeenCalled();
    });

    it('Should throw validation error when the monster does not exist', async () => {
      mockMonsterExistence.ensure.mockRejectedValue(new RelatedEntityValidationError('Monster', 'ghost'))

      await expect(service.create({ ...input, monsterId: 'ghost' })).rejects.toThrow(
        RelatedEntityValidationError
      );
      expect(mockMonsterExistence.ensure).toHaveBeenCalledWith('ghost');
      expect(mockQuestRepository.create).not.toHaveBeenCalled();
    });

    it('Should throw QuestValidationError when trying to create a quest with COMPLETED status', async () => {
      await expect(service.create({ ...input, status: 'COMPLETED' })).rejects.toThrow(
        QuestValidationError
      );
      expect(mockQuestRepository.create).not.toHaveBeenCalled();
    });

    it('Should throw QuestValidationError when trying to create a quest with FAILED status', async () => {
      await expect(service.create({ ...input, status: 'FAILED' })).rejects.toThrow(
        QuestValidationError
      );

      expect(mockQuestRepository.create).not.toHaveBeenCalled();
    });

    it('Should throw QuestValidationError when trying to create a quest with IN_PROGRESS status', async () => {
      await expect(service.create({ ...input, status: 'IN_PROGRESS' })).rejects.toThrow(
        QuestValidationError
      );

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
      mockMonsterExistence.ensure.mockRejectedValue(new RelatedEntityValidationError('Monster', 'ghost'));

      await expect(service.update('1', { monsterId: 'ghost' })).rejects.toThrow(
        RelatedEntityValidationError
      );
      expect(mockMonsterExistence.ensure).toHaveBeenCalledWith('ghost');
      expect(mockQuestRepository.update).not.toHaveBeenCalled();
    });

    it('Should change status from PENDING to IN_PROGRESS', async () => {
      const updateData = { status: 'IN_PROGRESS' } as { status: QuestStatus };
      const updatedQuest = { ...mockQuest, ...updateData };
      mockQuestRepository.findById.mockResolvedValue(mockQuest);
      mockQuestRepository.update.mockResolvedValue(updatedQuest);

      mockQuestAssignmentService.findByQuest.mockResolvedValue([
        { id: 'a1', hunterId: 'h1', questId: '1', role: 'Leader' },
      ]);

      const result = await service.update('1', updateData);

      expect(mockQuestRepository.findById).toHaveBeenCalledWith('1');
      expect(mockQuestRepository.update).toHaveBeenCalledWith('1', updateData);
      expect(result).toEqual(updatedQuest);
    });

    it('Should change status from IN_PROGRESS to COMPLETED', async () => {
      const currentData = { ...mockQuest, status: 'IN_PROGRESS' };
      const updateData = { status: 'COMPLETED' } as { status: QuestStatus };
      const updatedQuest = { ...currentData, ...updateData };
      mockQuestRepository.findById.mockResolvedValue(currentData as Quest);
      mockQuestRepository.update.mockResolvedValue(updatedQuest);

      const result = await service.update('1', updateData);

      expect(mockQuestRepository.findById).toHaveBeenCalledWith('1');
      expect(mockQuestRepository.update).toHaveBeenCalledWith('1', updateData);
      expect(result).toEqual(updatedQuest);
    });

    it('Should change status from IN_PROGRESS to FAILED', async () => {
      const currentData = { ...mockQuest, status: 'IN_PROGRESS' };
      const updateData = { status: 'FAILED' } as { status: QuestStatus };
      const updatedQuest = { ...currentData, ...updateData };
      mockQuestRepository.findById.mockResolvedValue(currentData as Quest);
      mockQuestRepository.update.mockResolvedValue(updatedQuest);

      const result = await service.update('1', updateData);

      expect(mockQuestRepository.findById).toHaveBeenCalledWith('1');
      expect(mockQuestRepository.update).toHaveBeenCalledWith('1', updateData);
      expect(result).toEqual(updatedQuest);
    });

    it('Should throw a QuestValidationError when changing status from PENDING to COMPLETED', async () => {
      mockQuestRepository.findById.mockResolvedValue(mockQuest);

      await expect(service.update('1', { status: 'COMPLETED' })).rejects.toThrow(
        QuestValidationError
      );
      expect(mockQuestRepository.update).not.toHaveBeenCalled();
    });

    it('Should throw when starting a quest with no hunters assigned', async () => {
      mockQuestRepository.findById.mockResolvedValue(mockQuest);
      mockQuestAssignmentService.findByQuest.mockResolvedValue([]);

      await expect(service.update('1', { status: 'IN_PROGRESS' })).rejects.toThrow(
        QuestValidationError
      );
      expect(mockQuestRepository.update).not.toHaveBeenCalled();
    });

    it('Should throw an error when starting a quest with no hunters leaders are assigned', async () => {
      mockQuestRepository.findById.mockResolvedValue(mockQuest);

      mockQuestAssignmentService.findByQuest.mockResolvedValue([
        { id: 'a1', hunterId: 'h1', questId: '1', role: 'Support' },
      ]);

      await expect(
        service.update('1', { status: 'IN_PROGRESS' })
      ).rejects.toThrow(QuestValidationError);

      expect(mockQuestRepository.update).not.toHaveBeenCalled();
    });

    it('Should distribute rewards when a quest is completed', async () => {
      const currentQuest: Quest = { ...mockQuest, status: 'IN_PROGRESS' };
      const completedQuest: Quest = { ...currentQuest, status: 'COMPLETED' };

      mockQuestRepository.findById.mockResolvedValue(currentQuest as Quest);
      mockQuestRepository.update.mockResolvedValue(completedQuest);
      await service.update('1', { status: 'COMPLETED' });
      expect(mockRewardDistributionService.distributeRewards).toHaveBeenCalledWith('1', 5000);
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
