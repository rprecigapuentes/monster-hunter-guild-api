import type { Response } from 'express';
import type { Prisma, Quest } from '../generated/prisma/client';
import { AbstractController } from './base-controller.abstract';
import type { QuestService } from '../services/quest.service';
import { QuestNotFoundError, QuestValidationError } from '../services/quest.service';

export class QuestController extends AbstractController<
  Quest,
  Prisma.QuestUncheckedCreateInput,
  Prisma.QuestUncheckedUpdateInput
> {
  constructor(service: QuestService) {
    super(service);
  }

  protected override handleError(error: unknown, res: Response): void {
    if (error instanceof QuestNotFoundError) {
      res.status(404).json({
        message: error.message,
      });
      return;
    }

    if (error instanceof QuestValidationError) {
      res.status(400).json({
        message: error.message,
      });
      return;
    }

    console.error(error);

    res.status(500).json({
      message: 'Internal server error',
    });
  }
}
