import request from 'supertest';
import express, { type Express } from 'express';
import { MonsterController } from './monster.controller';

const mockCreate = jest.fn();
const mockUpdate = jest.fn();
const mockDelete = jest.fn();
const mockFindById = jest.fn();
const mockFindAll = jest.fn();

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
    MonsterService: jest.fn().mockImplementation(() => ({
      create: mockCreate,
      update: mockUpdate,
      delete: mockDelete,
      findById: mockFindById,
      findAll: mockFindAll,
    })),
  };
});

import { MonsterNotFoundError, MonsterValidationError } from '../services/monster.service';

describe('MonsterController', () => {
  let app: Express;
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

    const monsterController = new MonsterController();

    app = express();
    app.use(express.json());
    app.post('/monsters', monsterController.create);
    app.get('/monsters', monsterController.findAll);
    app.get('/monsters/:id', monsterController.findById);
    app.put('/monsters/:id', monsterController.update);
    app.delete('/monsters/:id', monsterController.delete);
  });

  describe('POST /monsters', () => {
    it('should create a monster and responde with 201 and the created monster', async () => {
      const input = { name: 'Rathalos', dangerLevel: 5, rewardValue: 1500 };
      mockCreate.mockResolvedValue(mockMonster);

      const response = await request(app).post('/monsters').send(input);

      expect(mockCreate).toHaveBeenCalledWith(input);
      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockMonster);
    });

    it('Should respond with 400 when the service throws MonsterValidationError', async () => {
      mockCreate.mockRejectedValue(
        new MonsterValidationError('Monster danger level must be between 1 and 10')
      );

      const response = await request(app)
        .post('/monsters')
        .send({ name: 'Rathalos', dangerLevel: 11 });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'Monster danger level must be between 1 and 10' });
    });

    it('Should respond with 500 when an unexpected error occurs on create', async () => {
      mockCreate.mockRejectedValue(new Error('Unexpected DB Failure'));

      const response = await request(app).post('/monsters').send({ name: 'Rathalos' });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Internal server error' });
    });
  });

  describe('GET /monsters/:id', () => {
    it('Should return the monster and respond with 200 when it exists', async () => {
      mockFindById.mockResolvedValue(mockMonster);

      const response = await request(app).get('/monsters/1');

      expect(mockFindById).toHaveBeenCalledWith('1');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockMonster);
    });

    it('Should respond with 404 when the monster does not exist', async () => {
      mockFindById.mockRejectedValue(new MonsterNotFoundError('999'));

      const response = await request(app).get('/monsters/999');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Monster with id 999 was not found' });
    });
  });

  describe('GET /monsters', () => {
    it('Should return all monsters and respond with 200', async () => {
      const monsters = [
        mockMonster,
        { id: '2', name: 'Zinogre', dangerLevel: 6, rewardValue: 2000 },
      ];
      mockFindAll.mockResolvedValue(monsters);

      const response = await request(app).get('/monsters');

      expect(mockFindAll).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(monsters);
    });

    it('Should respond with 500 when an unexpected error occurs on findAll', async () => {
      mockFindAll.mockRejectedValue(new Error('Connection lost'));

      const response = await request(app).get('/monsters');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Internal server error' });
    });
  });

  describe('PUT /monsters/:id', () => {
    it('Should update the monster and respond with 200', async () => {
      const updateData = { name: 'Azure Rathalos' };
      const updatedMonster = { ...mockMonster, name: 'Azure Rathalos' };
      mockUpdate.mockResolvedValue(updatedMonster);

      const response = await request(app).put('/monsters/1').send(updateData);

      expect(mockUpdate).toHaveBeenCalledWith('1', updateData);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedMonster);
    });

    it('Should respond with 404 when trying to update a non-existent monster', async () => {
      mockUpdate.mockRejectedValue(new MonsterNotFoundError('999'));

      const response = await request(app).put('/monsters/999').send({ name: 'Apex' });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Monster with id 999 was not found' });
    });
  });

  describe('DELETE /monsters/:id', () => {
    it('Should delete the monster and respond with 204 (No Content)', async () => {
      mockDelete.mockResolvedValue(true);

      const response = await request(app).delete('/monsters/1');

      expect(mockDelete).toHaveBeenCalledWith('1');
      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
    });

    it('Should respond with 404 when trying to delete a non-existent monster', async () => {
      mockDelete.mockRejectedValue(new MonsterNotFoundError('999'));

      const response = await request(app).delete('/monsters/999');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Monster with id 999 was not found' });
    });
  });
});
