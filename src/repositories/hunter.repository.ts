import type { Hunter, Prisma } from '../generated/prisma/client';
import {
  type PrismaModelDelegate,
  PrismaBaseRepository,
} from './interfaces/prisma-base-repository.abstract';

export class HunterRepository extends PrismaBaseRepository<
  Hunter,
  Prisma.HunterUncheckedCreateInput,
  Prisma.HunterUncheckedUpdateInput
> {
  constructor(
    prismaModel: PrismaModelDelegate<
      Hunter,
      Prisma.HunterUncheckedCreateInput,
      Prisma.HunterUncheckedUpdateInput
    >
  ) {
    super(prismaModel);
  }
}
