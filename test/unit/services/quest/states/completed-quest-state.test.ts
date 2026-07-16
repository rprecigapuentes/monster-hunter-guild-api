import { type EventManager } from '../../../../../src/events/event-manager';
import { type Quest } from '../../../../../src/generated/prisma/client';
import { CompletedQuestState } from '../../../../../src/services/quest/states/completed-quest-state';
import { type RewardDistributionService } from '../../../../../src/services/reward-distribution.service';

describe('CompletedQuestState', () => {
  let state: CompletedQuestState;
  let mockRewardDistributionService: jest.Mocked<RewardDistributionService>;
  let mockEvents: jest.Mocked<EventManager>;
  const mockQuest = { id: 'uuid-uuid-uuid-uuid', title: 'Gold Rush', reward: 5000 } as Quest;

  beforeEach(() => {
    mockRewardDistributionService = {
      distributeRewards: jest.fn(),
    } as unknown as jest.Mocked<RewardDistributionService>;

    mockEvents = {
      notify: jest.fn(),
      subscribe: jest.fn(),
      unsubscribe: jest.fn(),
    } as unknown as jest.Mocked<EventManager>;

    state = new CompletedQuestState(mockRewardDistributionService, mockEvents);
  });

  it('should have COMPLETED status', () => {
    expect(state.status).toBe('COMPLETED');
  });

  it('should return no valid transitions', () => {
    expect(state.getValidTransitions()).toEqual([]);
  });

  it('should resolve validateBefore without throwing errors', async () => {
    await expect(state.validateBefore(mockQuest)).resolves.not.toThrow();
  });

  describe('onEnter', () => {
    it('should call distributeReward with correct parameters', async () => {
      mockRewardDistributionService.distributeRewards.mockResolvedValue(undefined);

      await state.onEnter(mockQuest);

      expect(mockRewardDistributionService.distributeRewards).toHaveBeenCalledWith(
        'uuid-uuid-uuid-uuid',
        5000
      );
    });

    it('emits quest.completed when entering', async () => {
      await state.onEnter(mockQuest);

      expect(mockEvents.notify).toHaveBeenCalledWith('quest.completed', {
        operation: 'COMPLETED',
        entity: 'Quest',
        entityId: 'uuid-uuid-uuid-uuid',
      });
    });
  });
});
