import type { Request, Response, NextFunction } from 'express';
import type { StatisticsService } from '../services/statistics.service';

export class StatisticsController {
  constructor(private readonly service: StatisticsService) {}
}
