import { type Quest } from '../../../generated/prisma/client';
import { type QuestStatus } from '../../../generated/prisma/enums';
import { type IQuestState } from './quest-state.interface';

export class PendingQuestState implements IQuestState {
  readonly status: QuestStatus = 'PENDING';

  getValidTransitions(): QuestStatus[] {
    return ['IN_PROGRESS'];
  }

  async validateBefore(_quest: Quest): Promise<void> {}

  async onEnter(_quest: Quest): Promise<void> {}
}
