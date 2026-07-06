import type { Request, Response, NextFunction } from 'express';
import type { Prisma } from '../generated/prisma/client';
import type { HunterService } from '../services/hunter.service';

export class HunterController {
  constructor(private readonly hunterService: HunterService) {}

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data: Prisma.HunterCreateInput = req.body;
      const hunter = await this.hunterService.create(data);
      res.status(201).json(hunter);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data: Prisma.HunterUpdateInput = req.body;
      const hunter = await this.hunterService.update(req.params.id, data);
      res.status(200).json(hunter);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.hunterService.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  findById = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const hunter = await this.hunterService.findById(req.params.id);
      res.status(200).json(hunter);
    } catch (error) {
      next(error);
    }
  };

  findAll = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const hunters = await this.hunterService.findAll();
      res.status(200).json(hunters);
    } catch (error) {
      next(error);
    }
  };
}
