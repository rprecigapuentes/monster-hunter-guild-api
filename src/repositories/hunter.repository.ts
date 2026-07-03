import type { Hunter, Prisma } from '../generated/prisma/client';
import {
  type PrismaModelDelegate,
  PrismaRepository,
} from './interfaces/prisma-repository.abstract';

export class HunterRepository extends PrismaRepository<
  Hunter,
  Prisma.HunterCreateInput,
  Prisma.HunterUpdateInput
> {
  constructor(
    prismaModel: PrismaModelDelegate<Hunter, Prisma.HunterCreateInput, Prisma.HunterUpdateInput>
  ) {
    super(prismaModel);
  }
}
