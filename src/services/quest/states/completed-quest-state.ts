import { type Quest } from '../../../generated/prisma/client';
import { type QuestStatus } from '../../../generated/prisma/enums';
import { type RewardDistributionService } from '../../reward-distribution.service';
import { type IQuestState } from './quest-state.interface';

export class CompletedQuestState implements IQuestState {
  readonly status: QuestStatus = 'COMPLETED';

  constructor(private readonly rewardDistributionService: RewardDistributionService) {}

  getValidTransitions(): QuestStatus[] {
    return [];
  }

  async validateBefore(_quest: Quest): Promise<void> {}

  async onEnter(_quest: Quest): Promise<void> {
    const { id, reward } = _quest;
    await this.rewardDistributionService.distributeRewards(id, reward as number);
  }
}
