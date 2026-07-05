import request from 'supertest';
import express, { type Express } from 'express';
import { HunterController } from '../../src/controllers/Hunter.controller';
import { HunterNotFoundError, HunterValidationError, type HunterService } from '../../src/services/hunter.service';
import type { Hunter } from '../../src/generated/prisma/client';

describe('HunterController', () => {
    let app: Express;
    let mockHunterService: jest.Mocked<HunterService>;

    const mockHunter: Hunter = {
        id: '1',
        name: 'Geralt',
        rank: 5,
        experiencePoints: 1000,
        guildId: 'guild-1',
    };

    beforeEach(() => {
        mockHunterService = {
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        findById: jest.fn(),
        findAll: jest.fn(),
        } as unknown as jest.Mocked<HunterService>;

        const hunterController = new HunterController(mockHunterService);

        app = express();
        app.use(express.json());
        app.post('/hunters', hunterController.create);
        app.get('/hunters', hunterController.findAll);
        app.get('/hunters/:id', hunterController.findById);
        app.put('/hunters/:id', hunterController.update);
        app.delete('/hunters/:id', hunterController.delete);
    });

    describe('POST /hunters', () => {
        it('should create a hunter and respond with 201', async () => {
        const input = { name: 'Geralt', rank: 5, experiencePoints: 1000, guildId: 'guild-1' };
        mockHunterService.create.mockResolvedValue(mockHunter);

        const response = await request(app).post('/hunters').send(input);

        expect(mockHunterService.create).toHaveBeenCalledWith(input);
        expect(response.status).toBe(201);
        expect(response.body).toEqual(mockHunter);
        });

        it('should respond with 400 when service throws HunterValidationError', async () => {
        mockHunterService.create.mockRejectedValue(new HunterValidationError('Hunter name is required'));

        const response = await request(app).post('/hunters').send({ name: '' });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: 'Hunter name is required' });
        });

        it('should respond with 500 when an unexpected error occurs', async () => {
        mockHunterService.create.mockRejectedValue(new Error('DB connection failed'));

        const response = await request(app).post('/hunters').send({ name: 'Geralt' });

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ message: 'Internal server error' });
        });
    });

    describe('GET /hunters', () => {
        it('should return all hunters and respond with 200', async () => {
        const hunters: Hunter[] = [
            mockHunter,
            { id: '2', name: 'Yennefer', rank: 8, experiencePoints: 5000, guildId: 'guild-1' },
        ];
        mockHunterService.findAll.mockResolvedValue(hunters);

        const response = await request(app).get('/hunters');

        expect(mockHunterService.findAll).toHaveBeenCalledTimes(1);
        expect(response.status).toBe(200);
        expect(response.body).toEqual(hunters);
        });

        it('should respond with 500 when an unexpected error occurs', async () => {
        mockHunterService.findAll.mockRejectedValue(new Error('DB connection failed'));

        const response = await request(app).get('/hunters');

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ message: 'Internal server error' });
        });
    });

    describe('GET /hunters/:id', () => {
        it('should return the hunter and respond with 200 when it exists', async () => {
        mockHunterService.findById.mockResolvedValue(mockHunter);

        const response = await request(app).get('/hunters/1');

        expect(mockHunterService.findById).toHaveBeenCalledWith('1');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockHunter);
        });

        it('should respond with 404 when the hunter does not exist', async () => {
        mockHunterService.findById.mockRejectedValue(new HunterNotFoundError('999'));

        const response = await request(app).get('/hunters/999');

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: 'Hunter with id 999 not found' });
        });
    });

    describe('PUT /hunters/:id', () => {
        it('should update the hunter and respond with 200', async () => {
        const updateData = { name: 'Cristian' };
        const updatedHunter = { ...mockHunter, name: 'Cristian' };
        mockHunterService.update.mockResolvedValue(updatedHunter);

        const response = await request(app).put('/hunters/1').send(updateData);

        expect(mockHunterService.update).toHaveBeenCalledWith('1', updateData);
        expect(response.status).toBe(200);
        expect(response.body).toEqual(updatedHunter);
        });

        it('should respond with 404 when the hunter does not exist', async () => {
        mockHunterService.update.mockRejectedValue(new HunterNotFoundError('999'));

        const response = await request(app).put('/hunters/999').send({ name: 'Cristian' });

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: 'Hunter with id 999 not found' });
        });
    });

    describe('DELETE /hunters/:id', () => {
        it('should delete the hunter and respond with 204', async () => {
        mockHunterService.delete.mockResolvedValue(true);

        const response = await request(app).delete('/hunters/1');

        expect(mockHunterService.delete).toHaveBeenCalledWith('1');
        expect(response.status).toBe(204);
        expect(response.body).toEqual({});
        });

        it('should respond with 404 when the hunter does not exist', async () => {
        mockHunterService.delete.mockRejectedValue(new HunterNotFoundError('999'));

        const response = await request(app).delete('/hunters/999');

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: 'Hunter with id 999 not found' });
        });
    });
});