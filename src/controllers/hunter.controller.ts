import type { Hunter, Prisma } from '../generated/prisma/client';
import { BaseController } from './base-controller.abstract';
import type { HunterService } from '../services/hunter.service';

export class HunterController extends BaseController<
  Hunter,
  Prisma.HunterCreateInput,
  Prisma.HunterUpdateInput
> {
  constructor(service: HunterService) {
    super(service);
  }
}
