import type { Prisma, QuestAssignment } from '../generated/prisma/client';
import { BaseController } from './base-controller.abstract';
import type { QuestAssignmentService } from '../services/quest-assignment.service';

export class QuestAssignmentController extends BaseController<
  QuestAssignment,
  Prisma.QuestAssignmentUncheckedCreateInput,
  Prisma.QuestAssignmentUncheckedUpdateInput
> {
  constructor(service: QuestAssignmentService) {
    super(service);
  }
}
