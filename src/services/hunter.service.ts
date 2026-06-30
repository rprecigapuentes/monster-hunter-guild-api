import type { Hunter, Prisma } from '../generated/prisma/client';
import type { HunterRepository } from '../repositories/hunter.repository';

export class HunterNotFoundError extends Error {
    constructor(id: string) {
        super(`Hunter with id ${id} not found`);
    }
}

export class HunterValidationError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export class HunterService {
    constructor(private readonly hunterRepository: HunterRepository) {}

    async create(data: Prisma.HunterCreateInput): Promise<Hunter> {
        return this.hunterRepository.create(data);
    }

    async findById(id: string): Promise<Hunter> {
        const hunter = await this.hunterRepository.findById(id);
        if (!hunter) throw new HunterNotFoundError(id);
        return hunter;
    }

    async findAll(): Promise<Hunter[]> {
        return this.hunterRepository.findAll();
    }

    async update(id: string, data: Prisma.HunterUpdateInput): Promise<Hunter> {
        const hunter = await this.hunterRepository.findById(id);
        if (!hunter) throw new HunterNotFoundError(id);
        return this.hunterRepository.update(id, data);
    }

    async delete(id: string): Promise<void> {
        const deleted = await this.hunterRepository.delete(id);
        if (!deleted) throw new HunterNotFoundError(id);
    }
}