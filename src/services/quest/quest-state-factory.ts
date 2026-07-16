import { type EventManager } from '../../events/event-manager';
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
  eventManager: EventManager;
}

export class QuestStateFactory {
  private states: Record<QuestStatus, IQuestState> | null = null;
  private eventManager: EventManager;
  private readonly getQuestAssignmentService: () => QuestAssignmentService;
  private readonly getRewardDistributionService: () => RewardDistributionService;

  constructor(private readonly deps: QuestStateFactoryDeps) {
    this.eventManager = deps.eventManager;
    this.getQuestAssignmentService = deps.getQuestAssignmentService;
    this.getRewardDistributionService = deps.getRewardDistributionService;
  }

  private initStates(): Record<QuestStatus, IQuestState> {
    if (!this.states) {
      this.states = {
        PENDING: new PendingQuestState(),
        IN_PROGRESS: new InProgresQuestState(this.getQuestAssignmentService()),
        COMPLETED: new CompletedQuestState(this.getRewardDistributionService(), this.eventManager),
        FAILED: new FailedQuestState(),
      };
    }

    return this.states;
  }

  getState(status: QuestStatus): IQuestState {
    return this.initStates()[status];
  }
}
