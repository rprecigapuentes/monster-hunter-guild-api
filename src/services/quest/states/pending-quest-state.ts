import { type Quest } from '../../../generated/prisma/client';
import { type QuestStatus } from '../../../generated/prisma/enums';
import { type IQuestState } from './quest-state.interface';

export class PendingQuestState implements IQuestState {
  readonly status: QuestStatus = 'PENDING';

  getValidTransitions(): QuestStatus[] {
    throw new Error('Method not implemented.');
  }

  async validateBefore(_quest: Quest): Promise<void> {
    return;
  }

  async onEnter(_quest: Quest): Promise<void> {
    return;
  }
}
