import type { Prisma, Quest } from '../generated/prisma/client';
import {
  type PrismaModelDelegate,
  PrismaBaseRepository,
} from './interfaces/prisma-base-repository.abstract';
import type { IQuestRepository } from './interfaces/quest-repository.interface';

export class QuestRepository
  extends PrismaBaseRepository<
    Quest,
    Prisma.QuestUncheckedCreateInput,
    Prisma.QuestUncheckedUpdateInput
  >
  implements IQuestRepository
{
  constructor(
    prismaModel: PrismaModelDelegate<
      Quest,
      Prisma.QuestUncheckedCreateInput,
      Prisma.QuestUncheckedUpdateInput
    >
  ) {
    super(prismaModel);
  }

  async averageReward(): Promise<number> {
    const result = (await this.model.aggregate({
      _avg: {
        reward: true,
      },
    })) as {
      _avg: {
        reward: number | null;
      };
    };

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
