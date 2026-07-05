import type { Monster, Prisma } from '../generated/prisma/client';
import type { PrismaBaseRepository } from '../repositories/interfaces/prisma-base-repository.abstract';
import { BaseService } from './base-service.abstract';

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

export class MonsterService extends BaseService<
  Monster,
  Prisma.MonsterCreateInput,
  Prisma.MonsterUpdateInput
> {
  constructor(
    repository: PrismaBaseRepository<Monster, Prisma.MonsterCreateInput, Prisma.MonsterUpdateInput>
  ) {
    super(repository);
  }

  protected notFoundError(id: string): Error {
    return new MonsterNotFoundError(id);
  }

  protected override async validateCreate(data: Prisma.MonsterCreateInput): Promise<void> {
    this.validateName(data.name);
    this.validateDangerLevel(data);
    this.validateRewardValue(data);
  }

  protected override async validateUpdate(data: Prisma.MonsterUpdateInput): Promise<void> {
    this.validateDangerLevel(data);
    this.validateRewardValue(data);
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
}
