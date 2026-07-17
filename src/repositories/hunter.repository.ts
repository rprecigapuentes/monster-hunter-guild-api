import type { Hunter, Prisma } from '../generated/prisma/client';
import { isStrictNumber } from '../utils/verify-strict-number';
import type { IHunterRepository } from './interfaces/hunter-repository.interface';
import {
  type PrismaModelDelegate,
  PrismaBaseRepository,
} from './interfaces/prisma-base-repository.abstract';
import { type ISearchableRepository } from './interfaces/searchable-repository.interface';

export class HunterRepository
  extends PrismaBaseRepository<
    Hunter,
    Prisma.HunterUncheckedCreateInput,
    Prisma.HunterUncheckedUpdateInput,
    Prisma.HunterWhereInput
  >
  implements ISearchableRepository<Hunter>, IHunterRepository
{
  constructor(
    prismaModel: PrismaModelDelegate<
      Hunter,
      Prisma.HunterUncheckedCreateInput,
      Prisma.HunterUncheckedUpdateInput,
      Prisma.HunterWhereInput
    >
  ) {
    super(prismaModel);
  }
  async search(query: string): Promise<Hunter[]> {
    const orConditions: Prisma.HunterWhereInput[] = [{ name: { contains: query } }];

    if (isStrictNumber(query)) {
      const parsedNumber = parseInt(query, 10);
      orConditions.push({ rank: parsedNumber }, { experiencePoints: parsedNumber });
    }

    return await this.model.findMany({
      where: {
        OR: orConditions,
      },
    });
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
