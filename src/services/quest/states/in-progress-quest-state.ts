import { type Quest } from '../../../generated/prisma/client';
import { type QuestStatus } from '../../../generated/prisma/enums';
import { type QuestAssignmentService } from '../../quest-assignment.service';
import { QuestValidationError } from '../quest.service';
import { type IQuestState } from './quest-state.interface';

export class InProgresQuestState implements IQuestState {
  readonly status: QuestStatus = 'IN_PROGRESS';

  constructor(private readonly questAssignmentService: QuestAssignmentService) {}
  getValidTransitions(): QuestStatus[] {
    return ['COMPLETED', 'FAILED'];
  }

  async validateBefore(_quest: Quest): Promise<void> {
    const assignments = await this.questAssignmentService.findByQuest(_quest.id);
    const hasLeader = assignments.some((assignment) => assignment.role === 'Leader');

    if (!hasLeader) {
      throw new QuestValidationError('A quest needs at least one leader before it can start');
    }
  }

  async onEnter(_quest: Quest): Promise<void> {}
}
