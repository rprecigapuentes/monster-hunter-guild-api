import type { Monster, Prisma } from '../generated/prisma/client';
import {
  type PrismaModelDelegate,
  PrismaBaseRepository,
} from './interfaces/prisma-base-repository.abstract';
import { type ISearchableRepository } from './interfaces/searchable-repository.interface';
import { isStrictNumber } from '../utils/verify-strict-number';

export class MonsterRepository
  extends PrismaBaseRepository<
    Monster,
    Prisma.MonsterCreateInput,
    Prisma.MonsterUpdateInput,
    Prisma.MonsterWhereInput
  >
  implements ISearchableRepository<Monster>
{
  constructor(
    prismaModel: PrismaModelDelegate<
      Monster,
      Prisma.MonsterCreateInput,
      Prisma.MonsterUpdateInput,
      Prisma.MonsterWhereInput
    >
  ) {
    super(prismaModel);
  }
  async search(query: string): Promise<Monster[]> {
    const orConditions: Prisma.MonsterWhereInput[] = [
      { name: { contains: query } },
      { species: { contains: query } },
    ];

    if (isStrictNumber(query)) {
      const parsedNumber = parseInt(query);
      orConditions.push({ dangerLevel: parsedNumber }, { rewardValue: parsedNumber });
    }

    return await this.model.findMany({
      where: {
        OR: orConditions,
      },
    });
  }
}
