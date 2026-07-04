import { HunterService, HunterNotFoundError } from '../../../src/services/hunter.service';
import type { HunterRepository } from '../../../src/repositories/hunter.repository';

describe('HunterService', () => {
    let service: HunterService;
    let mockRepository: jest.Mocked<HunterRepository>;

    const mockHunter = {
        id: '1',
        name: 'Geralt',
        rank: 5,
        experiencePoints: 1000,
        guildId: 'guild-1',
    };

    beforeEach(() => {
        mockRepository = {
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        findById: jest.fn(),
        findAll: jest.fn(),
        } as unknown as jest.Mocked<HunterRepository>;

        service = new HunterService(mockRepository);
    });

    describe('create', () => {
        it('should create a new hunter', async () => {
        const input = {
            name: 'Geralt',
            rank: 5,
            experiencePoints: 1000,
            guild: { connect: { id: 'guild-1' } },
        };
        mockRepository.create.mockResolvedValue(mockHunter);

        const result = await service.create(input);

        expect(mockRepository.create).toHaveBeenCalledWith(input);
        expect(result).toEqual(mockHunter);
        });
    });

    describe('findById', () => {
        it('should return hunter when it exists', async () => {
        mockRepository.findById.mockResolvedValue(mockHunter);

        const result = await service.findById('1');

        expect(mockRepository.findById).toHaveBeenCalledWith('1');
        expect(result).toEqual(mockHunter);
        });

        it('should throw HunterNotFoundError when hunter does not exist', async () => {
        mockRepository.findById.mockResolvedValue(null);

        await expect(service.findById('999')).rejects.toThrow(HunterNotFoundError);
        });
    });

    describe('findAll', () => {
        it('should return all hunters', async () => {
        const hunters = [mockHunter, { ...mockHunter, id: '2', name: 'Yennefer' }];
        mockRepository.findAll.mockResolvedValue(hunters);

        const result = await service.findAll();

        expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
        expect(result).toEqual(hunters);
        });
    });

    describe('update', () => {
        it('should update an existing hunter', async () => {
        const updateData = { name: 'Cristian' };
        const updatedHunter = { ...mockHunter, name: 'Cristian' };

        mockRepository.findById.mockResolvedValue(mockHunter);
        mockRepository.update.mockResolvedValue(updatedHunter);

        const result = await service.update('1', updateData);

        expect(mockRepository.findById).toHaveBeenCalledWith('1');
        expect(mockRepository.update).toHaveBeenCalledWith('1', updateData);
        expect(result).toEqual(updatedHunter);
        });

        it('should throw HunterNotFoundError when hunter does not exist', async () => {
        mockRepository.findById.mockResolvedValue(null);

        await expect(service.update('999', { name: 'Cristian' })).rejects.toThrow(HunterNotFoundError);
        expect(mockRepository.update).not.toHaveBeenCalled();
        });
    });

    describe('delete', () => {
        it('should delete an existing hunter', async () => {
        mockRepository.delete.mockResolvedValue(true);

        await service.delete('1');

        expect(mockRepository.delete).toHaveBeenCalledWith('1');
        });

        it('should throw HunterNotFoundError when hunter does not exist', async () => {
        mockRepository.delete.mockResolvedValue(false);

        await expect(service.delete('999')).rejects.toThrow(HunterNotFoundError);
        });
    });
});