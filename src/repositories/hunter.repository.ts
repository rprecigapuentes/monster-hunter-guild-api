import type { Hunter, Prisma } from '../generated/prisma/client';
import { prisma } from '../lib/prisma';
import { PrismaRepository } from './interfaces/prisma-repository.abstract';

export class HunterRepository extends PrismaRepository<
  Hunter,
  Prisma.HunterCreateInput,
  Prisma.HunterUpdateArgs
> {
  constructor() {
    super(prisma.hunter);
  }
}
