import type { Hunter, Prisma } from '../generated/prisma/client';
import {
  type PrismaModelDelegate,
  PrismaBaseRepository,
} from './interfaces/prisma-base-repository.abstract';

export class HunterRepository extends PrismaBaseRepository<
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
