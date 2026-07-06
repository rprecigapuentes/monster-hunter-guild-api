import type { Request, Response, NextFunction } from 'express';
import type { Prisma } from '../generated/prisma/client';
import type { GuildService } from '../services/guild.service';

export class GuildController {
  constructor(private readonly guildService: GuildService) {}

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data: Prisma.GuildCreateInput = req.body;
      const guild = await this.guildService.create(data);
      res.status(201).json(guild);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data: Prisma.GuildUpdateInput = req.body;
      const guild = await this.guildService.update(req.params.id, data);
      res.status(200).json(guild);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.guildService.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  findById = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const guild = await this.guildService.findById(req.params.id);
      res.status(200).json(guild);
    } catch (error) {
      next(error);
    }
  };

  findAll = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const guilds = await this.guildService.findAll();
      res.status(200).json(guilds);
    } catch (error) {
      next(error);
    }
  };
}