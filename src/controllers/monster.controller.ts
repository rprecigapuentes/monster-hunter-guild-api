import type { Monster, Prisma } from '../generated/prisma/client';
import { BaseController } from './base-controller.abstract';
import type { MonsterService } from '../services/monster.service';

export class MonsterController extends BaseController<
  Monster,
  Prisma.MonsterCreateInput,
  Prisma.MonsterUpdateInput
> {
  constructor(service: MonsterService) {
    super(service);
  }
}
