import type { Request, Response, NextFunction } from 'express';
import type { Prisma } from '../generated/prisma/client';
import type { QuestService } from '../services/quest.service';

export class QuestController {
  constructor(private readonly questService: QuestService) {}

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data: Prisma.QuestUncheckedCreateInput = req.body;
      const quest = await this.questService.create(data);
      res.status(201).json(quest);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data: Prisma.QuestUncheckedUpdateInput = req.body;
      const quest = await this.questService.update(req.params.id, data);
      res.status(200).json(quest);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.questService.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  findById = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const quest = await this.questService.findById(req.params.id);
      res.status(200).json(quest);
    } catch (error) {
      next(error);
    }
  };

  findAll = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const quests = await this.questService.findAll();
      res.status(200).json(quests);
    } catch (error) {
      next(error);
    }
  };
}
