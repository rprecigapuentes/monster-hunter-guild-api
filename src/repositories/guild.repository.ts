import type { Guild, Prisma } from '../generated/prisma/client';
import {
  type PrismaModelDelegate,
  PrismaBaseRepository,
} from './interfaces/prisma-base-repository.abstract';

export class GuildRepository extends PrismaBaseRepository<
  Guild,
  Prisma.GuildCreateInput,
  Prisma.GuildUpdateInput,
  Prisma.GuildWhereInput
> {
  constructor(
    prismaModel: PrismaModelDelegate<
      Guild,
      Prisma.GuildCreateInput,
      Prisma.GuildUpdateInput,
      Prisma.GuildWhereInput
    >
  ) {
    super(prismaModel);
  }
}
