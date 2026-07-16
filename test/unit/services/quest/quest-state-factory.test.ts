import { type EventManager } from '../../../../src/events/event-manager';
import { type QuestAssignmentService } from '../../../../src/services/quest-assignment.service';
import { QuestStateFactory } from '../../../../src/services/quest/quest-state-factory';
import { CompletedQuestState } from '../../../../src/services/quest/states/completed-quest-state';
import { FailedQuestState } from '../../../../src/services/quest/states/failed-quest-state';
import { InProgresQuestState } from '../../../../src/services/quest/states/in-progress-quest-state';
import { PendingQuestState } from '../../../../src/services/quest/states/pending-quest-state';
import { type RewardDistributionService } from '../../../../src/services/reward-distribution.service';

describe('QuestStateFactory', () => {
  let factory: QuestStateFactory;
  let mockQuestAssignmentService: jest.Mocked<QuestAssignmentService>;
  let mockRewardDistributionService: jest.Mocked<RewardDistributionService>;
  let getQuestAssignmentServiceMock: jest.Mock<QuestAssignmentService>;
  let getRewardDistributionServiceMock: jest.Mock<RewardDistributionService>;
  let mockEvents: jest.Mocked<EventManager>;

  beforeEach(() => {
    mockQuestAssignmentService = {} as jest.Mocked<QuestAssignmentService>;
    mockRewardDistributionService = {} as jest.Mocked<RewardDistributionService>;

    getQuestAssignmentServiceMock = jest.fn().mockReturnValue(mockQuestAssignmentService);
    getRewardDistributionServiceMock = jest.fn().mockReturnValue(mockRewardDistributionService);

    mockEvents = {
      notify: jest.fn(),
      subscribe: jest.fn(),
      unsubscribe: jest.fn(),
    } as unknown as jest.Mocked<EventManager>;

    factory = new QuestStateFactory({
      getQuestAssignmentService: getQuestAssignmentServiceMock,
      getRewardDistributionService: getRewardDistributionServiceMock,
      eventManager: mockEvents,
    });
  });

  it('should return PendingQuestState for PENDING status', () => {
    const state = factory.getState('PENDING');
    expect(state).toBeInstanceOf(PendingQuestState);
  });

  it('should return InProgresQuestState for IN_PROGRESS status and evaluate its getter', () => {
    const state = factory.getState('IN_PROGRESS');
    expect(state).toBeInstanceOf(InProgresQuestState);
    expect(getQuestAssignmentServiceMock).toHaveBeenCalledTimes(1);
  });

  it('should return CompletedQuestState for COMPLETED status and evalueate its getter', () => {
    const state = factory.getState('COMPLETED');
    expect(state).toBeInstanceOf(CompletedQuestState);
    expect(getRewardDistributionServiceMock).toHaveBeenCalledTimes(1);
  });

  it('should return FailedQuestState for FAILED status', () => {
    const state = factory.getState('FAILED');
    expect(state).toBeInstanceOf(FailedQuestState);
  });

  it('should cache and reuse state instances (lazy initialization cache validation)', () => {
    const pending1 = factory.getState('PENDING');
    const inProgress1 = factory.getState('IN_PROGRESS');

    const pending2 = factory.getState('PENDING');
    const inprogress2 = factory.getState('IN_PROGRESS');

    expect(pending1).toBe(pending2);
    expect(inProgress1).toBe(inprogress2);

    expect(getQuestAssignmentServiceMock).toHaveBeenCalledTimes(1);
    expect(getRewardDistributionServiceMock).toHaveBeenCalledTimes(1);
  });
});
