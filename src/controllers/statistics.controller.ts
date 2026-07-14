import type { Request, Response, NextFunction } from 'express';
import type { StatisticsService } from '../services/statistics.service';

export class StatisticsController {
  constructor(private readonly service: StatisticsService) {}

  questAverageReward = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const averageReward = await this.service.getQuestAverageReward();
      res.status(200).json({ averageReward });
    } catch (error) {
      next(error);
    }
  };

  entitiesCount = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const counts = await this.service.getEntitiesCount();
      res.status(200).json(counts);
    } catch (error) {
      next(error);
    }
  };

  completedQuestsCount = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const completedQuestsCount = await this.service.getCompletedQuestsCount();
      res.status(200).json(completedQuestsCount);
    } catch (error) {
      next(error);
    }
  };
}
