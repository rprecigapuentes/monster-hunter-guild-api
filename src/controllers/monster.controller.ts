import type { Request, Response, NextFunction } from 'express';
import type { Prisma } from '../generated/prisma/client';
import { type MonsterService } from '../services/monster.service';

export class MonsterController {
  constructor(private readonly monsterService: MonsterService) {}

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data: Prisma.MonsterCreateInput = req.body;
      const monster = await this.monsterService.create(data);
      res.status(201).json(monster);
    } catch (error) {
      next(error);
    }
  };

  update = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const data: Prisma.MonsterUpdateInput = req.body;
      const monster = await this.monsterService.update(req.params.id, data);
      res.status(200).json(monster);
    } catch (error) {
      next(error);
    }
  };

  delete = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await this.monsterService.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  findById = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const monster = await this.monsterService.findById(req.params.id);
      res.status(200).json(monster);
    } catch (error) {
      next(error);
    }
  };

  findAll = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const guilds = await this.monsterService.findAll();
      res.status(200).json(guilds);
    } catch (error) {
      next(error);
    }
  };
}
