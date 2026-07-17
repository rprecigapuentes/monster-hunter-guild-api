import request from 'supertest';
import express, { type Express } from 'express';
import { StatisticsController } from '../../../src/controllers/statistics.controller';
import { StatisticsService } from '../../../src/services/statistics/statistics.service';
import { errorHandler } from '../../../src/middlewares/error-handler.middleware';
import { notFound } from '../../../src/middlewares/not-found.middleware';
import { StatisticNotFoundError } from '../../../src/services/statistics/base-statistics.service';

describe('StatisticsController', () => {
  let app: Express;
  let mockStatisticsService: jest.Mocked<StatisticsService>;

  beforeEach(() => {
    mockStatisticsService = {
      getStatistics: jest.fn(),
      getStatistic: jest.fn(),
      getGlobalStatistic: jest.fn(),
    } as unknown as jest.Mocked<StatisticsService>;

    const statisticsController = new StatisticsController(mockStatisticsService);

    app = express();
    app.use(express.json());
    app.get('/statistics/global/:statistic', statisticsController.globalStatistic);
    app.get('/statistics/:entity/:statistic', statisticsController.entityStatistic);
    app.get('/statistics/:entity', statisticsController.entityStatistics);
    app.use(notFound);
    app.use(errorHandler);
  });

  describe('GET /statistics/:entity', () => {
    it('Should return all statistics for the entity and respond with 200', async () => {
      const statistics = { count: 10, averageReward: 1250.5 };
      mockStatisticsService.getStatistics.mockResolvedValue(statistics);

      const response = await request(app).get('/statistics/quests');

      expect(mockStatisticsService.getStatistics).toHaveBeenCalledWith('quests');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(statistics);
    });

    it('Should respond with 500 when an unexpected error occurs', async () => {
      mockStatisticsService.getStatistics.mockRejectedValue(new Error('DB connection failed'));

      const response = await request(app).get('/statistics/quests');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Internal server error' });
    });
  });

  describe('GET /statistics/:entity/:statistic', () => {
    it('Should return a single statistic and respond with 200', async () => {
      mockStatisticsService.getStatistic.mockResolvedValue(1250.5);

      const response = await request(app).get('/statistics/quests/averageReward');

      expect(mockStatisticsService.getStatistic).toHaveBeenCalledWith('quests', 'averageReward');
      expect(response.status).toBe(200);
      expect(response.body).toBe(1250.5);
    });

    it('Should call next(error) when the service rejects with StatisticNotFoundError', async () => {
      mockStatisticsService.getStatistic.mockRejectedValue(
        new StatisticNotFoundError('unknownStat', 'quests')
      );

      const response = await request(app).get('/statistics/quests/unknownStat');

      expect(mockStatisticsService.getStatistic).toHaveBeenCalledWith('quests', 'unknownStat');
      expect(response.status).not.toBe(200);
    });

    it('Should respond with 500 when an unexpected error occurs', async () => {
      mockStatisticsService.getStatistic.mockRejectedValue(new Error('DB connection failed'));

      const response = await request(app).get('/statistics/quests/averageReward');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Internal server error' });
    });
  });

  describe('GET /statistics/global/:statistic', () => {
    it('Should return the global statistic and respond with 200', async () => {
      const globalResult = { quests: 10, hunters: 5, guilds: 3 };
      mockStatisticsService.getGlobalStatistic.mockResolvedValue(globalResult);

      const response = await request(app).get('/statistics/global/count');

      expect(mockStatisticsService.getGlobalStatistic).toHaveBeenCalledWith('count');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(globalResult);
    });

    it('Should respond with 500 when an unexpected error occurs', async () => {
      mockStatisticsService.getGlobalStatistic.mockRejectedValue(new Error('DB connection failed'));

      const response = await request(app).get('/statistics/global/count');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Internal server error' });
    });
  });
});