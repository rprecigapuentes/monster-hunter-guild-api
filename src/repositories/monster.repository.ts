import { Monster, Prisma } from '../generated/prisma/client';
import { prisma } from '../lib/prisma';
import { PrismaRepository } from './interfaces/prisma-repository.abstract';

export class MonsterRepository extends PrismaRepository<
  Monster,
  Prisma.MonsterCreateInput,
  Prisma.MonsterUpdateInput
> {
  constructor() {
    super(prisma.monster);
  }
}
