import type { Prisma, QuestAssignment } from '../generated/prisma/client';
import {
  type PrismaModelDelegate,
  PrismaBaseRepository,
} from './interfaces/prisma-base-repository.abstract';

export class QuestAssignmentRepository extends PrismaBaseRepository<
  QuestAssignment,
  Prisma.QuestUncheckedCreateInput,
  Prisma.QuestUncheckedUpdateInput
> {
  constructor(
    prismaModel: PrismaModelDelegate<
      QuestAssignment,
      Prisma.QuestUncheckedCreateInput,
      Prisma.QuestUncheckedUpdateInput
    >
  ) {
    super(prismaModel);
  }
}
