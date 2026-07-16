import type { Monster, Prisma } from '../generated/prisma/client';
import {
  type PrismaModelDelegate,
  PrismaBaseRepository,
} from './interfaces/prisma-base-repository.abstract';

export class MonsterRepository extends PrismaBaseRepository<
  Monster,
  Prisma.MonsterCreateInput,
  Prisma.MonsterUpdateInput,
  Prisma.MonsterWhereInput
> {
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
}
