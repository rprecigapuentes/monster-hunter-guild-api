"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const guild_service_1 = require("../../src/services/guild.service");
describe('GuildService', () => {
    let service;
    let mockRepository;
    const mockGuild = {
        id: '1',
        name: 'Ravagers',
        region: 'South',
        headquarters: 'Princeton',
    };
    beforeEach(() => {
        mockRepository = {
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findById: jest.fn(),
            findAll: jest.fn(),
        };
        service = new guild_service_1.GuildService(mockRepository);
    });
    describe('Create Guild', () => {
        it('Should create a new guild', async () => {
            const input = {
                name: 'Ravagers',
                region: 'South',
                headquarters: 'Princeton',
            };
            mockRepository.create.mockResolvedValue(mockGuild);
            const result = await service.create(input);
            expect(mockRepository.create).toHaveBeenCalledWith(input);
            expect(result).toEqual(mockGuild);
        });
        it('Should throw validation error when guild name is empty', async () => {
            const input = {
                name: '',
                region: 'South',
                headquarters: 'Princeton',
            };
            await expect(service.create(input)).rejects.toThrow(guild_service_1.GuildValidationError);
            expect(mockRepository.create).not.toHaveBeenCalled();
        });
        it('Should throw validation error when name contains only spaces', async () => {
            const input = {
                name: '   ',
                region: 'South',
                headquarters: 'Princeton',
            };
            await expect(service.create(input)).rejects.toThrow(guild_service_1.GuildValidationError);
            expect(mockRepository.create).not.toHaveBeenCalled();
        });
    });
    describe('Update Guild', () => {
        it('Should update an existing guild', async () => {
            const updateData = {
                name: 'Devs',
            };
            const updatedGuild = {
                ...mockGuild,
                name: 'Devs',
            };
            mockRepository.findById.mockResolvedValue(mockGuild);
            mockRepository.update.mockResolvedValue(updatedGuild);
            const result = await service.update('1', updateData);
            expect(mockRepository.findById).toHaveBeenCalledWith('1');
            expect(mockRepository.update).toHaveBeenCalledWith('1', updateData);
            expect(result).toEqual(updatedGuild);
        });
        it('Should throw when guild does not exist', async () => {
            mockRepository.findById.mockResolvedValue(null);
            await expect(service.update('999', { name: 'Updated' })).rejects.toThrow(guild_service_1.GuildNotFoundError);
            expect(mockRepository.update).not.toHaveBeenCalled();
        });
    });
    describe('Delete Guild', () => {
        it('Should delete an existing guild', async () => {
            mockRepository.findById.mockResolvedValue(mockGuild);
            mockRepository.delete.mockResolvedValue(true);
            const result = await service.delete('1');
            expect(mockRepository.findById).toHaveBeenCalledWith('1');
            expect(mockRepository.delete).toHaveBeenCalledWith('1');
            expect(result).toBe(true);
        });
        it('Should throw when guild does not exist', async () => {
            mockRepository.findById.mockResolvedValue(null);
            await expect(service.delete('999')).rejects.toThrow(guild_service_1.GuildNotFoundError);
            expect(mockRepository.delete).not.toHaveBeenCalled();
        });
    });
    describe('Find Guild by ID', () => {
        it('Should return guild when it exists', async () => {
            mockRepository.findById.mockResolvedValue(mockGuild);
            const result = await service.findById('1');
            expect(mockRepository.findById).toHaveBeenCalledWith('1');
            expect(result).toEqual(mockGuild);
        });
        it('Should throw when guild does not exist', async () => {
            mockRepository.findById.mockResolvedValue(null);
            await expect(service.findById('999')).rejects.toThrow(guild_service_1.GuildNotFoundError);
        });
    });
    describe('findAll', () => {
        it('Should return all guilds', async () => {
            const guilds = [
                mockGuild,
                {
                    id: '2',
                    name: 'Hunters',
                    region: 'East',
                    headquarters: 'London',
                },
            ];
            mockRepository.findAll.mockResolvedValue(guilds);
            const result = await service.findAll();
            expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
            expect(result).toEqual(guilds);
        });
    });
});
