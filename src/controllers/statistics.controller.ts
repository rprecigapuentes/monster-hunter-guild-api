import type { Request, Response, NextFunction } from 'express';

import type { StatisticsService } from '../services/statistics/statistics.service';

export class StatisticsController {
  constructor(private readonly service: StatisticsService) {}

  entityStatistics = async (
    req: Request<{ entity: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { entity } = req.params;

      const statistics = await this.service.getStatistics(entity);

      res.status(200).json(statistics);
    } catch (error) {
      next(error);
    }
  };

  entityStatistic = async (
    req: Request<{ entity: string; statistic: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { entity, statistic } = req.params;

      const result = await this.service.getStatistic(entity, statistic);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  globalStatistic = async (
    req: Request<{ statistic: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { statistic } = req.params;

      const result = await this.service.getGlobalStatistic(statistic);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
