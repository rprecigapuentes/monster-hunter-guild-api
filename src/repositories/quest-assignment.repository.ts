import type { Prisma, QuestAssignment } from '../generated/prisma/client';
import {
  type PrismaModelDelegate,
  PrismaBaseRepository,
} from './interfaces/prisma-base-repository.abstract';

export class QuestAssignmentRepository extends PrismaBaseRepository<
  QuestAssignment,
  Prisma.QuestAssignmentUncheckedCreateInput,
  Prisma.QuestAssignmentUncheckedUpdateInput,
  Prisma.QuestAssignmentWhereInput
> {
  constructor(
    prismaModel: PrismaModelDelegate<
      QuestAssignment,
      Prisma.QuestAssignmentUncheckedCreateInput,
      Prisma.QuestAssignmentUncheckedUpdateInput,
      Prisma.QuestAssignmentWhereInput
    >
  ) {
    super(prismaModel);
  }
}
