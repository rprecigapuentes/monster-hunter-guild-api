import type { Monster, Prisma } from '../generated/prisma/client';
import {
  type PrismaModelDelegate,
  PrismaRepository,
} from './interfaces/prisma-repository.abstract';

export class MonsterRepository extends PrismaRepository<
  Monster,
  Prisma.MonsterCreateInput,
  Prisma.MonsterUpdateInput
> {
  constructor(
    prismaModel: PrismaModelDelegate<Monster, Prisma.MonsterCreateInput, Prisma.MonsterUpdateInput>
  ) {
    super(prismaModel);
  }
}
