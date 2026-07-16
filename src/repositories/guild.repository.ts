import type { Guild, Prisma } from '../generated/prisma/client';
import {
  type PrismaModelDelegate,
  PrismaBaseRepository,
} from './interfaces/prisma-base-repository.abstract';
import { type ISearchableRepository } from './interfaces/searchable-repository.interface';

export class GuildRepository
  extends PrismaBaseRepository<
    Guild,
    Prisma.GuildCreateInput,
    Prisma.GuildUpdateInput,
    Prisma.GuildWhereInput
  >
  implements ISearchableRepository<Guild>
{
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
  async search(query: string): Promise<Guild[]> {
    return this.model.findMany({
      where: {
        OR: [
          { name: { contains: query } },
          { region: { contains: query } },
          { headquarters: { contains: query } },
        ],
      },
    });
  }
}
