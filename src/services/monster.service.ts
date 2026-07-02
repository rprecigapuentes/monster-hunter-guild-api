import type { Monster, Prisma } from '../generated/prisma/client';
import { type MonsterRepository } from '../repositories/monster.repository';

export class MonsterNotFoundError extends Error {
  constructor(id: string) {
    super(`Monster with id ${id} was not found`);
    this.name = 'MonsterNotFoundError';
  }
}

export class MonsterValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MonsterValidationError';
  }
}

export class MonsterService {
  constructor(private readonly monsterRepository: MonsterRepository) {}

  async create(data: Prisma.MonsterCreateInput): Promise<Monster> {
    this.validateName(data.name);
    this.validateDangerLevel(data);
    this.validateRewardValue(data);
    return await this.monsterRepository.create(data);
  }

  async update(id: string, data: Prisma.MonsterUpdateInput): Promise<Monster> {
    await this.ensureExists(id);
    this.validateDangerLevel(data);
    this.validateRewardValue(data);
    return await this.monsterRepository.update(id, data);
  }

  async delete(id: string): Promise<boolean> {
    await this.ensureExists(id);
    return await this.monsterRepository.delete(id);
  }

  async findById(id: string): Promise<Monster> {
    return await this.ensureExists(id);
  }

  async findAll(): Promise<Monster[]> {
    return await this.monsterRepository.findAll();
  }

  private validateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new MonsterValidationError('Monster name is required');
    }
  }

  private validateDangerLevel(
    monster: Prisma.MonsterCreateInput | Prisma.MonsterUpdateInput
  ): void {
    const { dangerLevel } = monster;

    if (dangerLevel === undefined || dangerLevel === null) {
      return;
    }

    if (typeof dangerLevel === 'number') {
      if (dangerLevel < 1 || dangerLevel > 10) {
        throw new MonsterValidationError('Monster danger level must be between 1 and 10');
      }
    } else {
      throw new MonsterValidationError('Monster danger level must be a precise number value');
    }
  }

  private validateRewardValue(
    monster: Prisma.MonsterCreateInput | Prisma.MonsterUpdateInput
  ): void {
    const { rewardValue } = monster;

    if (rewardValue === undefined || rewardValue === null) {
      return;
    }

    if (typeof rewardValue === 'number') {
      if (rewardValue < 0) {
        throw new MonsterValidationError('Monster reward value must be greater or equal to 0');
      }
    } else {
      throw new MonsterValidationError('Monster reward value must be a precise number value');
    }
  }

  private async ensureExists(id: string): Promise<Monster> {
    const monster = await this.monsterRepository.findById(id);
    if (!monster) {
      throw new MonsterNotFoundError(id);
    }
    return monster;
  }
}
