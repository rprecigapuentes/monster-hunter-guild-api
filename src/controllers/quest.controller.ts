import type { Prisma, Quest } from '../generated/prisma/client';
import { BaseController } from './base-controller.abstract';
import type { QuestService } from '../services/quest/quest.service';

export class QuestController extends BaseController<
  Quest,
  Prisma.QuestUncheckedCreateInput,
  Prisma.QuestUncheckedUpdateInput
> {
  constructor(service: QuestService) {
    super(service);
  }
}
