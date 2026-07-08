import request from 'supertest';
import express, { type Express } from 'express';
import { QuestAssignmentController } from '../../../src/controllers/quest-assignment.controller';
import {
  QuestAssignmentNotFoundError,
  QuestAssignmentValidationError,
  type QuestAssignmentService,
} from '../../../src/services/quest-assignment.service';
import type { QuestAssignment } from '../../../src/generated/prisma/client';
import { errorHandler } from '../../../src/middlewares/error-handler.middleware';
import { notFound } from '../../../src/middlewares/not-found.middleware';

describe('QuestAssignmentController', () => {
  let app: Express;
  let mockService: jest.Mocked<QuestAssignmentService>;

  const mockAssignment: QuestAssignment = {
    id: 'a1',
    hunterId: 'h1',
    questId: 'q1',
    role: 'Support',
  };

  beforeEach(() => {
    mockService = {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
    } as unknown as jest.Mocked<QuestAssignmentService>;

    const controller = new QuestAssignmentController(mockService);

    app = express();
    app.use(express.json());
    app.post('/quest-assignments', controller.create);
    app.get('/quest-assignments', controller.findAll);
    app.get('/quest-assignments/:id', controller.findById);
    app.put('/quest-assignments/:id', controller.update);
    app.delete('/quest-assignments/:id', controller.delete);
    app.use(notFound);
    app.use(errorHandler);
  });

  describe('POST /quest-assignments', () => {
    it('Should create an assignment and respond with 201', async () => {
      const input = { hunterId: 'h1', questId: 'q1', role: 'Support' };
      mockService.create.mockResolvedValue(mockAssignment);

      const response = await request(app).post('/quest-assignments').send(input);

      expect(mockService.create).toHaveBeenCalledWith(input);
      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockAssignment);
    });

    it('Should respond with 400 when the service throws a validation error', async () => {
      mockService.create.mockRejectedValue(
        new QuestAssignmentValidationError('Quest already has a Leader')
      );

      const response = await request(app)
        .post('/quest-assignments')
        .send({ hunterId: 'h1', questId: 'q1', role: 'Leader' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'Quest already has a Leader' });
    });
  });

  describe('GET /quest-assignments', () => {
    it('Should return all assignments with 200', async () => {
      mockService.findAll.mockResolvedValue([mockAssignment]);

      const response = await request(app).get('/quest-assignments');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([mockAssignment]);
    });
  });

  describe('GET /quest-assignments/:id', () => {
    it('Should return the assignment with 200 when it exists', async () => {
      mockService.findById.mockResolvedValue(mockAssignment);

      const response = await request(app).get('/quest-assignments/a1');

      expect(mockService.findById).toHaveBeenCalledWith('a1');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockAssignment);
    });

    it('Should respond with 404 when it does not exist', async () => {
      mockService.findById.mockRejectedValue(new QuestAssignmentNotFoundError('999'));

      const response = await request(app).get('/quest-assignments/999');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'QuestAssignment with id 999 was not found' });
    });
  });

  describe('PUT /quest-assignments/:id', () => {
    it('Should update the assignment and respond with 200', async () => {
      const updateData = { role: 'Scout' };
      const updated = { ...mockAssignment, ...updateData };
      mockService.update.mockResolvedValue(updated as QuestAssignment);

      const response = await request(app).put('/quest-assignments/a1').send(updateData);

      expect(mockService.update).toHaveBeenCalledWith('a1', updateData);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(updated);
    });

    it('Should respond with 404 when the assignment does not exist', async () => {
      mockService.update.mockRejectedValue(new QuestAssignmentNotFoundError('999'));

      const response = await request(app).put('/quest-assignments/999').send({ role: 'Scout' });

      expect(response.status).toBe(404);
    });

    it('Should respond with 400 when the service throws a validation error', async () => {
      mockService.update.mockRejectedValue(
        new QuestAssignmentValidationError('Role must be one of: Leader, Support, Scout')
      );

      const response = await request(app).put('/quest-assignments/a1').send({ role: 'Healer' });

      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /quest-assignments/:id', () => {
    it('Should delete the assignment and respond with 204', async () => {
      mockService.delete.mockResolvedValue(true);

      const response = await request(app).delete('/quest-assignments/a1');

      expect(mockService.delete).toHaveBeenCalledWith('a1');
      expect(response.status).toBe(204);
    });

    it('Should respond with 404 when the assignment does not exist', async () => {
      mockService.delete.mockRejectedValue(new QuestAssignmentNotFoundError('999'));

      const response = await request(app).delete('/quest-assignments/999');

      expect(response.status).toBe(404);
    });
  });
});
