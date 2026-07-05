import type { Response } from 'express';
import type { Guild, Prisma } from '../generated/prisma/client';
import { AbstractController } from './base-controller.abstract';
import type { GuildService } from '../services/guild.service';
import { GuildNotFoundError, GuildValidationError } from '../services/guild.service';

export class GuildController extends AbstractController<
  Guild,
  Prisma.GuildCreateInput,
  Prisma.GuildUpdateInput
> {
  constructor(service: GuildService) {
    super(service);
  }

  protected override handleError(error: unknown, res: Response): void {
    if (error instanceof GuildNotFoundError) {
      res.status(404).json({
        message: error.message,
      });
      return;
    }

    if (error instanceof GuildValidationError) {
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
