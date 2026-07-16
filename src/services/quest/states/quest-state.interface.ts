import { type Quest } from '../../../generated/prisma/client';
import { type QuestStatus } from '../../../generated/prisma/enums';

export interface IQuestState {
  readonly status: QuestStatus;
  getValidTransitions(): QuestStatus[];
  validateBefore(_quest: Quest): Promise<void>;
  onEnter(_quest: Quest): Promise<void>;
}
