import { type QuestStatus } from '../../generated/prisma/enums';
import { type QuestAssignmentService } from '../quest-assignment.service';
import { type RewardDistributionService } from '../reward-distribution.service';
import { CompletedQuestState } from './states/completed-quest-state';
import { FailedQuestState } from './states/failed-quest-state';
import { InProgresQuestState } from './states/in-progress-quest-state';
import { PendingQuestState } from './states/pending-quest-state';
import { type IQuestState } from './states/quest-state.interface';

interface QuestStateFactoryDeps {
  getQuestAssignmentService: () => QuestAssignmentService;
  getRewardDistributionService: () => RewardDistributionService;
}

export class QuestStateFactory {
  private readonly states: Record<QuestStatus, IQuestState>;

  constructor(deps: QuestStateFactoryDeps) {
    this.states = {
      PENDING: new PendingQuestState(),
      IN_PROGRESS: new InProgresQuestState(deps.getQuestAssignmentService()),
      COMPLETED: new CompletedQuestState(deps.getRewardDistributionService()),
      FAILED: new FailedQuestState(),
    };
  }

  getState(status: QuestStatus): IQuestState {
    return this.states[status];
  }
}
