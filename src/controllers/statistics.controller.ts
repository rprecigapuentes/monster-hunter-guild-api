import type { Request, Response, NextFunction } from 'express';

import type { StatisticsService } from '../services/statistics/statistics.service';

export class StatisticsController {
  constructor(private readonly service: StatisticsService) {}

  entityStatistics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { entity } = req.params;

      const statistics = await this.service.getStatistics(entity as string);

      res.status(200).json(statistics);
    } catch (error) {
      next(error);
    }
  };

  entityStatistic = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { entity, statistic } = req.params;

      const result = await this.service.getStatistic(entity as string, statistic as string);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  globalStatistic = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { statistic } = req.params;

      const result = await this.service.getGlobalStatistic(statistic as string);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
