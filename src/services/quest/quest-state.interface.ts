import { type Quest } from '../../generated/prisma/client';
import { type QuestStatus } from '../../generated/prisma/enums';

export interface IQuestState {
  status: QuestStatus;
  getValidTransitions(): QuestStatus[];
  validateBefore(quest: Quest): Promise<void>;
  onEnter(quest: Quest): Promise<void>;
}
