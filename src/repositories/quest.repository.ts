import type { Prisma, Quest } from '../generated/prisma/client';
import {
  type PrismaModelDelegate,
  PrismaBaseRepository,
} from './interfaces/prisma-base-repository.abstract';

export class QuestRepository extends PrismaBaseRepository<
  Quest,
  Prisma.QuestUncheckedCreateInput,
  Prisma.QuestUncheckedUpdateInput
> {
  constructor(
    prismaModel: PrismaModelDelegate<
      Quest,
      Prisma.QuestUncheckedCreateInput,
      Prisma.QuestUncheckedUpdateInput
    >
  ) {
    super(prismaModel);
  }
}
