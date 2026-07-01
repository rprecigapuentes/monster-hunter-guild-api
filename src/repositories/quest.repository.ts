import type { Prisma, Quest } from '../generated/prisma/client';
import { prisma } from '../lib/prisma';
import { PrismaRepository } from './interfaces/prisma-repository.abstract';

export class QuestRepository extends PrismaRepository<
  Quest,
  Prisma.QuestUncheckedCreateInput,
  Prisma.QuestUpdateInput
> {
  constructor() {
    super(prisma.quest);
  }
}
