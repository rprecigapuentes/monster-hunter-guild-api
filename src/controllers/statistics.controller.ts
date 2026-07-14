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
}
