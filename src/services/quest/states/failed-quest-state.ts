import { type Quest } from '../../../generated/prisma/client';
import { type QuestStatus } from '../../../generated/prisma/enums';
import { type IQuestState } from './quest-state.interface';

export class FailedQuestState implements IQuestState {
  readonly status: QuestStatus = 'FAILED';

  getValidTransitions(): QuestStatus[] {
    return ['PENDING'];
  }

  async validateBefore(_quest: Quest): Promise<void> {}

  async onEnter(_quest: Quest): Promise<void> {}
}
