import { Guild, Prisma } from '../generated/prisma/client';
import { prisma } from '../lib/prisma';
import { PrismaRepository } from './interfaces/prisma-repository.abstract';

export class GuildRepository extends PrismaRepository<
  Guild,
  Prisma.GuildCreateInput,
  Prisma.GuildUpdateInput
> {
  constructor() {
    super(prisma.guild);
  }
}
