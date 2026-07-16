import { type Quest } from '../../../../../src/generated/prisma/client';
import { type QuestAssignmentService } from '../../../../../src/services/quest-assignment.service';
import { QuestValidationError } from '../../../../../src/services/quest/quest.service';
import { InProgresQuestState } from '../../../../../src/services/quest/states/in-progress-quest-state';

describe('InProgressQuestState', () => {
  let state: InProgresQuestState;
  let mockQuestAssignmentService: jest.Mocked<QuestAssignmentService>;
  const mockQuest = { id: 'uuid-uuid-uuid-uuid', title: 'Active Quest' } as Quest;

  beforeEach(() => {
    mockQuestAssignmentService = {
      findByQuest: jest.fn(),
    } as unknown as jest.Mocked<QuestAssignmentService>;

    state = new InProgresQuestState(mockQuestAssignmentService);
  });

  it('should have IN_PROGRESS status', () => {
    expect(state.status).toBe('IN_PROGRESS');
  });

  it('should return valid transitions to COMPLETED an FAILED', () => {
    expect(state.getValidTransitions()).toEqual(['COMPLETED', 'FAILED']);
  });

  describe('validateBefore', () => {
    it('should resolve without throwing errors if the quest has a Leader assigned', async () => {
      mockQuestAssignmentService.findByQuest.mockResolvedValue([
        { id: 'a1', hunterId: 'h1', questId: 'uuid-uuid-uuid-uuid', role: 'Leader' },
      ]);

      await expect(state.validateBefore(mockQuest)).resolves.not.toThrow();
      expect(mockQuestAssignmentService.findByQuest).toHaveBeenCalledWith('uuid-uuid-uuid-uuid');
    });

    it('should throw a QuestValidationError if there is no Leader in the assignments', async () => {
      mockQuestAssignmentService.findByQuest.mockResolvedValue([
        { id: 'a1', hunterId: 'h1', questId: 'uuid-uuid-uuid-uuid', role: 'Support' },
      ]);

      await expect(state.validateBefore(mockQuest)).rejects.toThrow(QuestValidationError);
    });

    it('should throw a QuestValidationError if there are no assignments al all', async () => {
      mockQuestAssignmentService.findByQuest.mockResolvedValue([]);

      await expect(state.validateBefore(mockQuest)).rejects.toThrow(
        'A quest needs at least one leader before it can start'
      );
    });

    it('should resolve onEnter without throwing errors', async () => {
      await expect(state.onEnter(mockQuest)).resolves.not.toThrow();
    });
  });
});
