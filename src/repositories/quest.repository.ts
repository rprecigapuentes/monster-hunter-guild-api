import type { Prisma, Quest } from '../generated/prisma/client';
import {
  type PrismaModelDelegate,
  PrismaRepository,
} from './interfaces/prisma-repository.abstract';

export class QuestRepository extends PrismaRepository<
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
