import { type Prisma, type Quest, QuestStatus } from '../generated/prisma/client';
import { isStrictNumber } from '../utils/verify-strict-number';
import {
  type PrismaModelDelegate,
  PrismaBaseRepository,
} from './interfaces/prisma-base-repository.abstract';
import { type ISearchableRepository } from './interfaces/searchable-repository.interface';

export class QuestRepository
  extends PrismaBaseRepository<
    Quest,
    Prisma.QuestUncheckedCreateInput,
    Prisma.QuestUncheckedUpdateInput,
    Prisma.QuestWhereInput
  >
  implements ISearchableRepository<Quest>
{
  constructor(
    prismaModel: PrismaModelDelegate<
      Quest,
      Prisma.QuestUncheckedCreateInput,
      Prisma.QuestUncheckedUpdateInput,
      Prisma.QuestWhereInput
    >
  ) {
    super(prismaModel);
  }
  async search(query: string): Promise<Quest[]> {
    const orConditions: Prisma.QuestWhereInput[] = [
      { title: { contains: query } },
      { location: { contains: query } },
    ];

    const matchedQuestStatuses: QuestStatus[] = Object.values(QuestStatus).filter((status) =>
      status.toLowerCase().includes(query.toLocaleLowerCase())
    );

    if (matchedQuestStatuses.length > 0) {
      orConditions.push({ status: { in: matchedQuestStatuses } });
    }

    if (isStrictNumber(query)) {
      const parsedQuery = parseInt(query, 10);
      orConditions.push({ reward: parsedQuery });
    }

    return this.model.findMany({
      where: {
        OR: orConditions,
      },
    });
  }
}
