import type { Guild, Prisma } from '../generated/prisma/client';
import { BaseController } from './base-controller.abstract';
import type { GuildService } from '../services/guild.service';

export class GuildController extends BaseController<
  Guild,
  Prisma.GuildCreateInput,
  Prisma.GuildUpdateInput
> {
  constructor(service: GuildService) {
    super(service);
  }
}
