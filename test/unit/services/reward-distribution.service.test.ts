import { RewardDistributionService } from '../../../src/services/reward-distribution.service';

describe('RewardDistributionService', () => {
  let service: RewardDistributionService;

  let mockHunterService: {
    addExperience: jest.Mock;
  };

  let mockQuestAssignmentService: {
    findByQuest: jest.Mock;
  };

  beforeEach(() => {
    mockHunterService = {
      addExperience: jest.fn(),
    };

    mockQuestAssignmentService = {
      findByQuest: jest.fn(),
    };

    service = new RewardDistributionService(
      mockHunterService as any,
      mockQuestAssignmentService as any
    );
  });

  it('Should distribute 40% reward to leader and remaining equally to members', async () => {
    mockQuestAssignmentService.findByQuest.mockResolvedValue([
      {
        id: '1',
        hunterId: 'hunter-1',
        questId: 'quest-1',
        role: 'Leader',
      },
      {
        id: '2',
        hunterId: 'hunter-2',
        questId: 'quest-1',
        role: 'Support',
      },
      {
        id: '3',
        hunterId: 'hunter-3',
        questId: 'quest-1',
        role: 'Scout',
      },
    ]);

    await service.distributeRewards('quest-1', 1000);
    expect(mockHunterService.addExperience).toHaveBeenCalledWith('hunter-1', 400);
    expect(mockHunterService.addExperience).toHaveBeenCalledWith('hunter-2', 300);
    expect(mockHunterService.addExperience).toHaveBeenCalledWith('hunter-3', 300);
  });

  it('Should not distribute rewards when reward is zero', async () => {
    await service.distributeRewards('quest-1', 0);
    expect(mockQuestAssignmentService.findByQuest).not.toHaveBeenCalled();
    expect(mockHunterService.addExperience).not.toHaveBeenCalled();
  });

  it('Should distribute only to leader when there are no members', async () => {
    mockQuestAssignmentService.findByQuest.mockResolvedValue([
      {
        id: '1',
        hunterId: 'hunter-1',
        questId: 'quest-1',
        role: 'Leader',
      },
    ]);

    await service.distributeRewards('quest-1', 1000);
    expect(mockHunterService.addExperience).toHaveBeenCalledWith('hunter-1', 400);
  });
});
