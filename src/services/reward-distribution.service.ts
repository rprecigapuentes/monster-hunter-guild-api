import type { IRewardDistributionStrategy } from '../strategies/reward/interfaces/reward-distribution-strategy.interface';
import type { HunterService } from './hunter.service';
import type { QuestAssignmentService } from './quest-assignment.service';

export class RewardDistributionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RewardDistributionError';
  }
}

interface RewardDistributionServiceDependencies {
  hunterService: HunterService;
  getQuestAssignmentService: () => QuestAssignmentService;
  strategy: IRewardDistributionStrategy;
}

export class RewardDistributionService {
  private readonly hunterService: HunterService;
  private readonly getQuestAssignmentService: () => QuestAssignmentService;
  private readonly strategy: IRewardDistributionStrategy;

  constructor(deps: RewardDistributionServiceDependencies) {
    this.hunterService = deps.hunterService;
    this.getQuestAssignmentService = deps.getQuestAssignmentService;
    this.strategy = deps.strategy;
  }

  async distributeRewards(questId: string, reward: number): Promise<void> {
    if (reward === 0) {
      return;
    }

    const questAssignmentService = this.getQuestAssignmentService();
    const assignments = await questAssignmentService.findByQuest(questId);

    const distribution = this.strategy.distribute(reward, assignments);

    for (const allocation of distribution) {
      await this.hunterService.addExperience(allocation.hunterId, allocation.experience);
    }
  }
}
