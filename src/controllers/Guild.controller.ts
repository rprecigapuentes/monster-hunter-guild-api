import type { Request, Response } from 'express';
import type { Prisma } from '../generated/prisma/client';
import type { GuildService } from '../services/guild.service';
import { GuildNotFoundError, GuildValidationError } from '../services/guild.service';

export class GuildController {
  constructor(private readonly guildService: GuildService) {}

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const data: Prisma.GuildCreateInput = req.body;
      const guild = await this.guildService.create(data);
      res.status(201).json(guild);
    } catch (error) {
      this.handleError(error, res);
    }
  };

  update = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
      const data: Prisma.GuildUpdateInput = req.body;
      const guild = await this.guildService.update(req.params.id, data);
      res.status(200).json(guild);
    } catch (error) {
      this.handleError(error, res);
    }
  };

  delete = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
      await this.guildService.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      this.handleError(error, res);
    }
  };

  findById = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
      const guild = await this.guildService.findById(req.params.id);
      res.status(200).json(guild);
    } catch (error) {
      this.handleError(error, res);
    }
  };

  findAll = async (_req: Request, res: Response): Promise<void> => {
    try {
      const guilds = await this.guildService.findAll();
      res.status(200).json(guilds);
    } catch (error) {
      this.handleError(error, res);
    }
  };

  private handleError(error: unknown, res: Response): void {
    if (error instanceof GuildNotFoundError) {
      res.status(404).json({ message: error.message });
      return;
    }
    if (error instanceof GuildValidationError) {
      res.status(400).json({ message: error.message });
      return;
    }
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
