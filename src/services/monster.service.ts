import type { Monster, Prisma } from '../generated/prisma/client';
import type { IBasicRepository } from '../repositories/interfaces/basic-repository.interface';
import { BaseService } from './base-service.abstract';
import type { EventManager } from '../events/event-manager';
import { type ISearchableRepository } from '../repositories/interfaces/searchable-repository.interface';
import { type ISearchableService } from './interfaces/searchable-service.interface';
import { type ISearchResult } from './interfaces/search-result.interface';

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

type MonsterRepositoryType = IBasicRepository<
  Monster,
  Prisma.MonsterCreateInput,
  Prisma.MonsterUpdateInput
> &
  ISearchableRepository<Monster>;

export class MonsterService
  extends BaseService<
    Monster,
    Prisma.MonsterCreateInput,
    Prisma.MonsterUpdateInput,
    MonsterRepositoryType
  >
  implements ISearchableService
{
  constructor(repository: MonsterRepositoryType, events: EventManager) {
    super(repository, events);
  }
  async search(query: string): Promise<ISearchResult> {
    const trimed = query.trim();
    const data = await this.repository.search(trimed);

    return {
      resourceName: 'Monsters',
      result: data,
    };
  }

  protected get entityName(): string {
    return 'Monster';
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
