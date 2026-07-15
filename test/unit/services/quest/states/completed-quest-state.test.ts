import { type Quest } from '../../../../../src/generated/prisma/client';
import { CompletedQuestState } from '../../../../../src/services/quest/states/completed-quest-state';
import { type RewardDistributionService } from '../../../../../src/services/reward-distribution.service';

describe('CompletedQuestState', () => {
  let state: CompletedQuestState;
  let mockRewardDistributionService: jest.Mocked<RewardDistributionService>;
  const mockQuest = { id: 'uuid-uuid-uuid-uuid', title: 'Gold Rush', reward: 5000 } as Quest;

  beforeEach(() => {
    mockRewardDistributionService = {
      distributeRewards: jest.fn(),
    } as unknown as jest.Mocked<RewardDistributionService>;

    state = new CompletedQuestState(mockRewardDistributionService);
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
  });
});
