import { type Prisma, type Quest, QuestStatus } from '../generated/prisma/client';
import { isStrictNumber } from '../utils/verify-strict-number';
import {
  type PrismaModelDelegate,
  PrismaBaseRepository,
} from './interfaces/prisma-base-repository.abstract';
import { type ISearchableRepository } from './interfaces/searchable-repository.interface';
import type { IQuestRepository } from './interfaces/quest-repository.interface';

export class QuestRepository
  extends PrismaBaseRepository<
    Quest,
    Prisma.QuestUncheckedCreateInput,
    Prisma.QuestUncheckedUpdateInput,
    Prisma.QuestWhereInput
  >
  implements ISearchableRepository<Quest>, IQuestRepository
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

  async averageReward(): Promise<number> {
    const result = (await this.model.aggregate({
      _avg: {
        reward: true,
      },
    })) as { _avg: { reward: number | null } };

    return result._avg.reward ?? 0;
  }

  async countCompletedQuests(): Promise<number> {
    const result = await this.model.count({
      where: {
        status: 'COMPLETED',
      },
    });

    return result;
  }
}
