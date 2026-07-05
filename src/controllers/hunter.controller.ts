import type { Response } from 'express';
import type { Hunter, Prisma } from '../generated/prisma/client';
import { BaseController } from './base-controller.abstract';
import type { HunterService } from '../services/hunter.service';
import { HunterNotFoundError, HunterValidationError } from '../services/hunter.service';

export class HunterController extends BaseController<
  Hunter,
  Prisma.HunterCreateInput,
  Prisma.HunterUpdateInput
> {
  constructor(service: HunterService) {
    super(service);
  }

  protected override handleError(error: unknown, res: Response): void {
    if (error instanceof HunterNotFoundError) {
      res.status(404).json({
        message: error.message,
      });
      return;
    }

    if (error instanceof HunterValidationError) {
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
