import {
  QuestAssignmentService,
  QuestAssignmentNotFoundError,
  QuestAssignmentValidationError,
} from '../../../src/services/quest-assignment.service';
import type { QuestAssignmentRepository } from '../../../src/repositories/quest-assignment.repository';
import type { QuestAssignment, Hunter, Quest } from '../../../src/generated/prisma/client';
import { EntityExistenceValidator } from '../../../src/services/entity-existence-validator';
import { RelatedEntityValidationError } from '../../../src/errors/related-entity-validation.error';

describe('QuestAssignmentService', () => {
  let service: QuestAssignmentService;
  let mockRepository: jest.Mocked<QuestAssignmentRepository>;
  let mockQuestExistence: jest.Mocked<EntityExistenceValidator>;
  let mockHunterExistence: jest.Mocked<EntityExistenceValidator>;

  const mockHunter: Hunter = {
    id: 'h1',
    name: 'Aiden',
    rank: 5,
    experiencePoints: 1000,
    guildId: 'g1',
  };
  const mockQuest: Quest = {
    id: 'q1',
    title: 'Hunt the Rathalos',
    location: 'Ancient Forest',
    reward: 5000,
    status: 'PENDING',
    monsterId: 'm1',
  };
  const mockAssignment: QuestAssignment = {
    id: 'a1',
    hunterId: 'h1',
    questId: 'q1',
    role: 'Support',
  };

  const input = { hunterId: 'h1', questId: 'q1', role: 'Support' as const };

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
    } as unknown as jest.Mocked<QuestAssignmentRepository>;

    mockQuestExistence = { ensure: jest.fn() } as unknown as jest.Mocked<EntityExistenceValidator>;
    mockHunterExistence = { ensure: jest.fn() } as unknown as jest.Mocked<EntityExistenceValidator>;

    service = new QuestAssignmentService(mockRepository, mockQuestExistence, mockHunterExistence);
  });

  describe('Create assignment', () => {
    it('Should create an assignment when data is valid', async () => {
      mockQuestExistence.ensure.mockResolvedValue(undefined);
      mockHunterExistence.ensure.mockResolvedValue(undefined);
      mockRepository.findAll.mockResolvedValue([]);
      mockRepository.create.mockResolvedValue(mockAssignment);

      const result = await service.create(input);

      expect(mockQuestExistence.ensure).toHaveBeenCalledWith('q1');
      expect(mockHunterExistence.ensure).toHaveBeenCalledWith('h1');
      expect(mockRepository.create).toHaveBeenCalledWith(input);
      expect(result).toEqual(mockAssignment);
    });

    it('Should throw when the role is not allowed', async () => {
      await expect(service.create({ ...input, role: 'Healer' as never })).rejects.toThrow(
        QuestAssignmentValidationError
      );
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('Should throw when the quest does not exist', async () => {
      mockQuestExistence.ensure.mockRejectedValue(new RelatedEntityValidationError('Quest', 'q1'));

      await expect(service.create(input)).rejects.toThrow(RelatedEntityValidationError);
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('Should throw when the hunter does not exist', async () => {
      mockQuestExistence.ensure.mockResolvedValue(undefined);
      mockHunterExistence.ensure.mockRejectedValue(new RelatedEntityValidationError('Hunter', 'h1'));

      await expect(service.create(input)).rejects.toThrow(RelatedEntityValidationError);
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('Should throw when the hunter is already assigned to the quest', async () => {
      mockQuestExistence.ensure.mockResolvedValue(undefined);
      mockHunterExistence.ensure.mockResolvedValue(undefined);
      mockRepository.findAll.mockResolvedValue([mockAssignment]);

      await expect(service.create(input)).rejects.toThrow(QuestAssignmentValidationError);
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('Should throw when the quest already has a Leader', async () => {
      mockQuestExistence.ensure.mockResolvedValue(undefined);
      mockHunterExistence.ensure.mockResolvedValue(undefined);
      mockRepository.findAll.mockResolvedValue([
        { id: 'a0', hunterId: 'h2', questId: 'q1', role: 'Leader' },
      ]);

      await expect(
        service.create({ hunterId: 'h1', questId: 'q1', role: 'Leader' })
      ).rejects.toThrow(QuestAssignmentValidationError);
      expect(mockRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('Update assignment', () => {
    it('Should update an existing assignment', async () => {
      const updateData = { role: 'Scout' as const };
      const updated = { ...mockAssignment, ...updateData };
      mockRepository.findById.mockResolvedValue(mockAssignment);
      mockRepository.findAll.mockResolvedValue([mockAssignment]);
      mockRepository.update.mockResolvedValue(updated);

      const result = await service.update('a1', updateData);

      expect(mockRepository.update).toHaveBeenCalledWith('a1', updateData);
      expect(result).toEqual(updated);
    });

    it('Should throw when the assignment does not exist', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.update('999', { role: 'Scout' })).rejects.toThrow(
        QuestAssignmentNotFoundError
      );
      expect(mockRepository.update).not.toHaveBeenCalled();
    });

    it('Should throw when updating to an invalid role', async () => {
      mockRepository.findById.mockResolvedValue(mockAssignment);

      await expect(service.update('a1', { role: 'Healer' as never })).rejects.toThrow(
        QuestAssignmentValidationError
      );
      expect(mockRepository.update).not.toHaveBeenCalled();
    });

    it('Should throw when promoting to Leader while another Leader exists', async () => {
      mockRepository.findById.mockResolvedValue(mockAssignment);
      mockRepository.findAll.mockResolvedValue([
        mockAssignment,
        { id: 'a2', hunterId: 'h2', questId: 'q1', role: 'Leader' },
      ]);

      await expect(service.update('a1', { role: 'Leader' })).rejects.toThrow(
        QuestAssignmentValidationError
      );
      expect(mockRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('Delete assignment', () => {
    it('Should delete an existing assignment', async () => {
      mockRepository.findById.mockResolvedValue(mockAssignment);
      mockRepository.delete.mockResolvedValue(true);

      const result = await service.delete('a1');

      expect(mockRepository.delete).toHaveBeenCalledWith('a1');
      expect(result).toBe(true);
    });

    it('Should throw when the assignment does not exist', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.delete('999')).rejects.toThrow(QuestAssignmentNotFoundError);
      expect(mockRepository.delete).not.toHaveBeenCalled();
    });
  });

  describe('Find by ID', () => {
    it('Should return the assignment when it exists', async () => {
      mockRepository.findById.mockResolvedValue(mockAssignment);

      const result = await service.findById('a1');

      expect(result).toEqual(mockAssignment);
    });

    it('Should throw when the assignment does not exist', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.findById('999')).rejects.toThrow(QuestAssignmentNotFoundError);
    });
  });

  describe('findAll', () => {
    it('Should return all assignments', async () => {
      mockRepository.findAll.mockResolvedValue([mockAssignment]);

      const result = await service.findAll();

      expect(result).toEqual([mockAssignment]);
    });
  });
});
