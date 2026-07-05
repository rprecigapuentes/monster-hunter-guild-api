import type { Response } from 'express';
import type { Monster, Prisma } from '../generated/prisma/client';
import { AbstractController } from './base-controller.abstract';
import type { MonsterService } from '../services/monster.service';
import { MonsterNotFoundError, MonsterValidationError } from '../services/monster.service';

export class MonsterController extends AbstractController<
  Monster,
  Prisma.MonsterCreateInput,
  Prisma.MonsterUpdateInput
> {
  constructor(service: MonsterService) {
    super(service);
  }

  protected override handleError(error: unknown, res: Response): void {
    if (error instanceof MonsterNotFoundError) {
      res.status(404).json({
        message: error.message,
      });
      return;
    }

    if (error instanceof MonsterValidationError) {
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
