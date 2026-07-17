import type { Hunter, Prisma } from '../generated/prisma/client';
import type { IHunterRepository } from './interfaces/hunter-repository.interface';
import {
  type PrismaModelDelegate,
  PrismaBaseRepository,
} from './interfaces/prisma-base-repository.abstract';

export class HunterRepository
  extends PrismaBaseRepository<
    Hunter,
    Prisma.HunterUncheckedCreateInput,
    Prisma.HunterUncheckedUpdateInput
  >
  implements IHunterRepository
{
  constructor(
    prismaModel: PrismaModelDelegate<
      Hunter,
      Prisma.HunterUncheckedCreateInput,
      Prisma.HunterUncheckedUpdateInput
    >
  ) {
    super(prismaModel);
  }
  async hunterLeaderboard(): Promise<Hunter[]> {
    const hunters = await this.model.findMany({
      orderBy: [
        {
          rank: 'desc',
        },
        {
          experiencePoints: 'desc',
        },
      ],
    });

    return hunters;
  }
}
