import request from 'supertest';
import express, { type Express } from 'express';
import { QuestController } from '../../../src/controllers/quest.controller';
import {
  QuestNotFoundError,
  QuestValidationError,
  type QuestService,
} from '../../../src/services/quest.service';
import type { Quest } from '../../../src/generated/prisma/client';
import { errorHandler } from '../../../src/middlewares/error-handler.middleware';
import { notFound } from '../../../src/middlewares/not-found.middleware';

describe('QuestController', () => {
  let app: Express;
  let mockQuestService: jest.Mocked<QuestService>;

  const mockQuest: Quest = {
    id: '1',
    title: 'Hunt the Rathalos',
    location: 'Ancient Forest',
    reward: 5000,
    status: 'OPEN',
    monsterId: 'm1',
  };

  beforeEach(() => {
    mockQuestService = {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
    } as unknown as jest.Mocked<QuestService>;

    const questController = new QuestController(mockQuestService);

    app = express();
    app.use(express.json());
    app.post('/quests', questController.create);
    app.get('/quests', questController.findAll);
    app.get('/quests/:id', questController.findById);
    app.put('/quests/:id', questController.update);
    app.delete('/quests/:id', questController.delete);
    app.use(notFound);
    app.use(errorHandler);
  });

  describe('POST /quests', () => {
    it('Should create a quest and respond with 201 and the created quest', async () => {
      const input = { title: 'Hunt the Rathalos', monsterId: 'm1', reward: 5000 };
      mockQuestService.create.mockResolvedValue(mockQuest);

      const response = await request(app).post('/quests').send(input);

      expect(mockQuestService.create).toHaveBeenCalledWith(input);
      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockQuest);
    });

    it('Should respond with 400 when the service throws QuestValidationError', async () => {
      mockQuestService.create.mockRejectedValue(new QuestValidationError('Quest title is required'));

      const response = await request(app).post('/quests').send({ title: '' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'Quest title is required' });
    });

    it('Should respond with 500 when an unexpected error occurs', async () => {
      mockQuestService.create.mockRejectedValue(new Error('DB connection failed'));

      const response = await request(app).post('/quests').send({ title: 'Hunt' });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Internal server error' });
    });
  });

  describe('GET /quests/:id', () => {
    it('Should return the quest and respond with 200 when it exists', async () => {
      mockQuestService.findById.mockResolvedValue(mockQuest);

      const response = await request(app).get('/quests/1');

      expect(mockQuestService.findById).toHaveBeenCalledWith('1');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockQuest);
    });

    it('Should respond with 404 when the quest does not exist', async () => {
      mockQuestService.findById.mockRejectedValue(new QuestNotFoundError('999'));

      const response = await request(app).get('/quests/999');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Quest with id 999 was not found' });
    });
  });

  describe('GET /quests', () => {
    it('Should return all quests and respond with 200', async () => {
      const quests: Quest[] = [mockQuest, { ...mockQuest, id: '2', title: 'Slay the Nergigante' }];
      mockQuestService.findAll.mockResolvedValue(quests);

      const response = await request(app).get('/quests');

      expect(mockQuestService.findAll).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(quests);
    });

    it('Should respond with 500 when an unexpected error occurs', async () => {
      mockQuestService.findAll.mockRejectedValue(new Error('DB connection failed'));

      const response = await request(app).get('/quests');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Internal server error' });
    });
  });

  describe('PUT /quests/:id', () => {
    it('Should update the quest and respond with 200', async () => {
      const updateData = { title: 'Updated title', reward: 9000 };
      const updatedQuest = { ...mockQuest, ...updateData };
      mockQuestService.update.mockResolvedValue(updatedQuest);

      const response = await request(app).put('/quests/1').send(updateData);

      expect(mockQuestService.update).toHaveBeenCalledWith('1', updateData);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedQuest);
    });

    it('Should respond with 404 when the quest does not exist', async () => {
      mockQuestService.update.mockRejectedValue(new QuestNotFoundError('999'));

      const response = await request(app).put('/quests/999').send({ title: 'x' });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Quest with id 999 was not found' });
    });

    it('Should respond with 400 when the service throws QuestValidationError', async () => {
      mockQuestService.update.mockRejectedValue(new QuestValidationError('Quest reward must be >= 0'));

      const response = await request(app).put('/quests/1').send({ reward: -1 });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'Quest reward must be >= 0' });
    });
  });

  describe('DELETE /quests/:id', () => {
    it('Should delete the quest and respond with 204 and no content', async () => {
      mockQuestService.delete.mockResolvedValue(true);

      const response = await request(app).delete('/quests/1');

      expect(mockQuestService.delete).toHaveBeenCalledWith('1');
      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
    });

    it('Should respond with 404 when the quest does not exist', async () => {
      mockQuestService.delete.mockRejectedValue(new QuestNotFoundError('999'));

      const response = await request(app).delete('/quests/999');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Quest with id 999 was not found' });
    });
  });
});
