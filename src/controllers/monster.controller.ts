import type { Request, Response } from 'express';
import type { Prisma } from '../generated/prisma/client';
import { type MonsterService } from '../services/monster.service';
import { MonsterNotFoundError, MonsterValidationError } from '../services/monster.service';

export class MonsterController {
  constructor(private readonly monsterService: MonsterService) {}

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const data: Prisma.MonsterCreateInput = req.body;
      const monster = await this.monsterService.create(data);
      res.status(201).json(monster);
    } catch (error) {
      this.handleError(error, res);
    }
  };

  update = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
      const data: Prisma.MonsterUpdateInput = req.body;
      const monster = await this.monsterService.update(req.params.id, data);
      res.status(200).json(monster);
    } catch (error) {
      this.handleError(error, res);
    }
  };

  delete = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
      await this.monsterService.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      this.handleError(error, res);
    }
  };

  findById = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
      const monster = await this.monsterService.findById(req.params.id);
      res.status(200).json(monster);
    } catch (error) {
      this.handleError(error, res);
    }
  };

  findAll = async (_req: Request, res: Response): Promise<void> => {
    try {
      const guilds = await this.monsterService.findAll();
      res.status(200).json(guilds);
    } catch (error) {
      this.handleError(error, res);
    }
  };

  private handleError(error: unknown, res: Response): void {
    if (error instanceof MonsterNotFoundError) {
      res.status(404).json({ message: error.message });
      return;
    }
    if (error instanceof MonsterValidationError) {
      res.status(400).json({ message: error.message });
      return;
    }
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
