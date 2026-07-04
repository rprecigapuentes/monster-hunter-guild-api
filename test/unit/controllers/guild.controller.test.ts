import request from 'supertest';
import express, { type Express } from 'express';
import { GuildController } from '../../../src/controllers/guild.controller';
import { GuildNotFoundError, GuildValidationError, type GuildService } from '../../../src/services/guild.service';
import type { Guild } from '../../../src/generated/prisma/client';

describe('GuildController', () => {
  let app: Express;
  let mockGuildService: jest.Mocked<GuildService>;

  const mockGuild: Guild = {
    id: '1',
    name: 'Ravagers',
    region: 'South',
    headquarters: 'Princeton',
  };

  beforeEach(() => {
    mockGuildService = {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
    } as unknown as jest.Mocked<GuildService>;

    const guildController = new GuildController(mockGuildService);

    app = express();
    app.use(express.json());
    app.post('/guilds', guildController.create);
    app.get('/guilds', guildController.findAll);
    app.get('/guilds/:id', guildController.findById);
    app.put('/guilds/:id', guildController.update);
    app.delete('/guilds/:id', guildController.delete);
  });

  describe('POST /guilds', () => {
    it('Should create a guild and respond with 201 and the created guild', async () => {
      const input = { name: 'Ravagers', region: 'South', headquarters: 'Princeton' };
      mockGuildService.create.mockResolvedValue(mockGuild);
      const response = await request(app).post('/guilds').send(input);
      expect(mockGuildService.create).toHaveBeenCalledWith(input);
      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockGuild);
    });

    it('Should respond with 400 when the service throws GuildValidationError', async () => {
      mockGuildService.create.mockRejectedValue(new GuildValidationError('Guild name is required'));
      const response = await request(app).post('/guilds').send({ name: '' });
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'Guild name is required' });
    });

    it('Should respond with 500 when an unexpected error occurs', async () => {
      mockGuildService.create.mockRejectedValue(new Error('DB connection failed'));
      const response = await request(app).post('/guilds').send({ name: 'Ravagers' });
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Internal server error' });
    });
  });

  describe('GET /guilds/:id', () => {
    it('Should return the guild and respond with 200 when it exists', async () => {
      mockGuildService.findById.mockResolvedValue(mockGuild);
      const response = await request(app).get('/guilds/1');
      expect(mockGuildService.findById).toHaveBeenCalledWith('1');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockGuild);
    });

    it('Should respond with 404 when the guild does not exist', async () => {
      mockGuildService.findById.mockRejectedValue(new GuildNotFoundError('999'));
      const response = await request(app).get('/guilds/999');
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Guild with id 999 was not found' });
    });
  });

  describe('GET /guilds', () => {
    it('Should return all guilds and respond with 200', async () => {
      const guilds: Guild[] = [
        mockGuild,
        { id: '2', name: 'Hunters', region: 'East', headquarters: 'London' },
      ];
      mockGuildService.findAll.mockResolvedValue(guilds);
      const response = await request(app).get('/guilds');
      expect(mockGuildService.findAll).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(guilds);
    });

    it('Should respond with 500 when an unexpected error occurs', async () => {
      mockGuildService.findAll.mockRejectedValue(new Error('DB connection failed'));
      const response = await request(app).get('/guilds');
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Internal server error' });
    });
  });

  describe('PUT /guilds/:id', () => {
    it('Should update the guild and respond with 200', async () => {
      const updateData = { name: 'Devs' };
      const updatedGuild = { ...mockGuild, name: 'Devs' };
      mockGuildService.update.mockResolvedValue(updatedGuild);
      const response = await request(app).put('/guilds/1').send(updateData);
      expect(mockGuildService.update).toHaveBeenCalledWith('1', updateData);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedGuild);
    });

    it('Should respond with 404 when the guild does not exist', async () => {
      mockGuildService.update.mockRejectedValue(new GuildNotFoundError('999'));
      const response = await request(app).put('/guilds/999').send({ name: 'Devs' });
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Guild with id 999 was not found' });
    });
  });

  describe('DELETE /guilds/:id', () => {
    it('Should delete the guild and respond with 204 and no content', async () => {
      mockGuildService.delete.mockResolvedValue(true);
      const response = await request(app).delete('/guilds/1');
      expect(mockGuildService.delete).toHaveBeenCalledWith('1');
      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
    });

    it('Should respond with 404 when the guild does not exist', async () => {
      mockGuildService.delete.mockRejectedValue(new GuildNotFoundError('999'));
      const response = await request(app).delete('/guilds/999');
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Guild with id 999 was not found' });
    });
  });
});