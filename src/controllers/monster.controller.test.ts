import request from 'supertest';
import express, { type Express } from 'express';
import { MonsterController } from './monster.controller';
import {
  MonsterNotFoundError,
  type MonsterService,
  MonsterValidationError,
} from '../services/monster.service';
import { errorHandler } from '../../src/middlewares/error-handler.middleware';
import { notFound } from '../../src/middlewares/not-found.middleware';

jest.mock('../services/monster.service', () => {
  return {
    MonsterNotFoundError: class MonsterNotFoundError extends Error {
      constructor(id: string) {
        super(`Monster with id ${id} was not found`);
        this.name = 'MonsterNotFoundError';
      }
    },
    MonsterValidationError: class MonsterValidationError extends Error {
      constructor(message: string) {
        super(message);
        this.name = 'MonsterValidationError';
      }
    },
  };
});

describe('MonsterController', () => {
  let app: Express;
  let mockMonsterService: jest.Mocked<MonsterService>;
  let consoleSpy: jest.SpyInstance;

  const mockMonster = {
    id: 'm1',
    name: 'Rathalos',
    dangerLevel: 5,
    rewardValue: 1500,
    species: 'undead',
  };

  beforeAll(() => {
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    consoleSpy.mockRestore();
  });

  beforeEach(() => {
    jest.clearAllMocks();

    mockMonsterService = {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
    } as unknown as jest.Mocked<MonsterService>;

    const monsterController = new MonsterController(mockMonsterService);

    app = express();
    app.use(express.json());
    app.post('/monsters', monsterController.create);
    app.get('/monsters', monsterController.findAll);
    app.get('/monsters/:id', monsterController.findById);
    app.put('/monsters/:id', monsterController.update);
    app.delete('/monsters/:id', monsterController.delete);
    app.use(notFound);
    app.use(errorHandler);
  });

  describe('POST /monsters', () => {
    it('should create a monster and responde with 201 and the created monster', async () => {
      const input = { name: 'Rathalos', dangerLevel: 5, rewardValue: 1500 };
      mockMonsterService.create.mockResolvedValue(mockMonster);

      const response = await request(app).post('/monsters').send(input);

      expect(mockMonsterService.create).toHaveBeenCalledWith(input);
      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockMonster);
    });

    it('Should respond with 400 when the service throws MonsterValidationError', async () => {
      mockMonsterService.create.mockRejectedValue(
        new MonsterValidationError('Monster danger level must be between 1 and 10')
      );

      const response = await request(app)
        .post('/monsters')
        .send({ name: 'Rathalos', dangerLevel: 11 });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'Monster danger level must be between 1 and 10' });
    });

    it('Should respond with 500 when an unexpected error occurs on create', async () => {
      mockMonsterService.create.mockRejectedValue(new Error('Unexpected DB Failure'));

      const response = await request(app).post('/monsters').send({ name: 'Rathalos' });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Internal server error' });
    });
  });

  describe('GET /monsters/:id', () => {
    it('Should return the monster and respond with 200 when it exists', async () => {
      mockMonsterService.findById.mockResolvedValue(mockMonster);

      const response = await request(app).get('/monsters/1');

      expect(mockMonsterService.findById).toHaveBeenCalledWith('1');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockMonster);
    });

    it('Should respond with 404 when the monster does not exist', async () => {
      mockMonsterService.findById.mockRejectedValue(new MonsterNotFoundError('999'));

      const response = await request(app).get('/monsters/999');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Monster with id 999 was not found' });
    });
  });

  describe('GET /monsters', () => {
    it('Should return all monsters and respond with 200', async () => {
      const monsters = [
        mockMonster,
        { id: '2', name: 'Zinogre', dangerLevel: 6, rewardValue: 2000, species: 'troll' },
      ];
      mockMonsterService.findAll.mockResolvedValue(monsters);

      const response = await request(app).get('/monsters');

      expect(mockMonsterService.findAll).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(monsters);
    });

    it('Should respond with 500 when an unexpected error occurs on findAll', async () => {
      mockMonsterService.findAll.mockRejectedValue(new Error('Connection lost'));

      const response = await request(app).get('/monsters');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Internal server error' });
    });
  });

  describe('PUT /monsters/:id', () => {
    it('Should update the monster and respond with 200', async () => {
      const updateData = { name: 'Azure Rathalos' };
      const updatedMonster = { ...mockMonster, name: 'Azure Rathalos' };
      mockMonsterService.update.mockResolvedValue(updatedMonster);

      const response = await request(app).put('/monsters/1').send(updateData);

      expect(mockMonsterService.update).toHaveBeenCalledWith('1', updateData);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedMonster);
    });

    it('Should respond with 404 when trying to update a non-existent monster', async () => {
      mockMonsterService.update.mockRejectedValue(new MonsterNotFoundError('999'));

      const response = await request(app).put('/monsters/999').send({ name: 'Apex' });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Monster with id 999 was not found' });
    });
  });

  describe('DELETE /monsters/:id', () => {
    it('Should delete the monster and respond with 204 (No Content)', async () => {
      mockMonsterService.delete.mockResolvedValue(true);

      const response = await request(app).delete('/monsters/1');

      expect(mockMonsterService.delete).toHaveBeenCalledWith('1');
      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
    });

    it('Should respond with 404 when trying to delete a non-existent monster', async () => {
      mockMonsterService.delete.mockRejectedValue(new MonsterNotFoundError('999'));

      const response = await request(app).delete('/monsters/999');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Monster with id 999 was not found' });
    });
  });
});
