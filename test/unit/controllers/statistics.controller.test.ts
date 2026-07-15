import request from 'supertest';
import express, { type Express } from 'express';
import { StatisticsController } from '../../../src/controllers/statistics.controller';
import type { StatisticsService } from '../../../src/services/statistics.service';
import { errorHandler } from '../../../src/middlewares/error-handler.middleware';
import { notFound } from '../../../src/middlewares/not-found.middleware';

describe('StatisticsController', () => {
  let app: Express;
  let mockStatisticsService: jest.Mocked<StatisticsService>;

  beforeEach(() => {
    mockStatisticsService = {
      getQuestAverageReward: jest.fn(),
      getEntitiesCount: jest.fn(),
      getCompletedQuestsCount: jest.fn(),
      getHunterLeaderboard: jest.fn(),
    } as unknown as jest.Mocked<StatisticsService>;

    const statisticsController = new StatisticsController(mockStatisticsService);

    app = express();
    app.use(express.json());
    app.get('/statistics/quests/average-reward', statisticsController.questAverageReward);
    app.get('/statistics/entities/count', statisticsController.entitiesCount);
    app.get('/statistics/quests/completed', statisticsController.completedQuestsCount);
    app.get('/statistics/hunters/leaderboard', statisticsController.hunterLeaderboard);
    app.use(notFound);
    app.use(errorHandler);
  });

  describe('GET /statistics/quests/average-reward', () => {
    it('Should return the average reward and respond with 200', async () => {
      const averageReward = { averageReward: 1250.5 };
      mockStatisticsService.getQuestAverageReward.mockResolvedValue(averageReward);

      const response = await request(app).get('/statistics/quests/average-reward');

      expect(mockStatisticsService.getQuestAverageReward).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(averageReward);
    });

    it('Should respond with 500 when an unexpected error occurs', async () => {
      mockStatisticsService.getQuestAverageReward.mockRejectedValue(
        new Error('DB connection failed')
      );

      const response = await request(app).get('/statistics/quests/average-reward');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Internal server error' });
    });
  });

  describe('GET /statistics/entities/count', () => {
    it('Should return the entity counts and respond with 200', async () => {
      const counts = { quests: 10, hunters: 5, guilds: 3, monsters: 8 };
      mockStatisticsService.getEntitiesCount.mockResolvedValue(counts);

      const response = await request(app).get('/statistics/entities/count');

      expect(mockStatisticsService.getEntitiesCount).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(counts);
    });

    it('Should respond with 500 when an unexpected error occurs', async () => {
      mockStatisticsService.getEntitiesCount.mockRejectedValue(new Error('DB connection failed'));

      const response = await request(app).get('/statistics/entities/count');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Internal server error' });
    });
  });

  describe('GET /statistics/quests/completed', () => {
    it('Should return the completed quests count and respond with 200', async () => {
      const completedQuestsCount = { completedQuests: 7 };
      mockStatisticsService.getCompletedQuestsCount.mockResolvedValue(completedQuestsCount);

      const response = await request(app).get('/statistics/quests/completed');

      expect(mockStatisticsService.getCompletedQuestsCount).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(completedQuestsCount);
    });

    it('Should respond with 500 when an unexpected error occurs', async () => {
      mockStatisticsService.getCompletedQuestsCount.mockRejectedValue(
        new Error('DB connection failed')
      );

      const response = await request(app).get('/statistics/quests/completed');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Internal server error' });
    });
  });

  describe('GET /statistics/hunters/leaderboard', () => {
    it('Should return the hunter leaderboard and respond with 200', async () => {
      const leaderboard = {
        leaderboard: [{ id: '1', name: 'Aiden', rank: 5, experiencePoints: 5000, guildId: 'g1' }],
      };
      mockStatisticsService.getHunterLeaderboard.mockResolvedValue(leaderboard);

      const response = await request(app).get('/statistics/hunters/leaderboard');

      expect(mockStatisticsService.getHunterLeaderboard).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(leaderboard);
    });

    it('Should respond with 500 when an unexpected error occurs', async () => {
      mockStatisticsService.getHunterLeaderboard.mockRejectedValue(
        new Error('DB connection failed')
      );

      const response = await request(app).get('/statistics/hunters/leaderboard');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Internal server error' });
    });
  });
});
