import type { Guild, Prisma } from '../generated/prisma/client';
import {
  type PrismaModelDelegate,
  PrismaRepository,
} from './interfaces/prisma-repository.abstract';

export class GuildRepository extends PrismaRepository<
  Guild,
  Prisma.GuildCreateInput,
  Prisma.GuildUpdateInput
> {
  constructor(
    prismaModel: PrismaModelDelegate<Guild, Prisma.GuildCreateInput, Prisma.GuildUpdateInput>
  ) {
    super(prismaModel);
  }
}
