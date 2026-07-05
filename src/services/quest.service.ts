import type { Prisma, Quest } from '../generated/prisma/client';
import type { PrismaRepository } from '../repositories/interfaces/prisma-repository.abstract';
import type { MonsterService } from './monster.service';
import { AbstractService } from './service.abstract';

export class QuestNotFoundError extends Error {
  constructor(id: string) {
    super(`Quest with id ${id} was not found`);
    this.name = 'QuestNotFoundError';
  }
}

export class QuestValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'QuestValidationError';
  }
}

export class QuestService extends AbstractService<
  Quest,
  Prisma.QuestUncheckedCreateInput,
  Prisma.QuestUncheckedUpdateInput
> {
  constructor(
    repository: PrismaRepository<
      Quest,
      Prisma.QuestUncheckedCreateInput,
      Prisma.QuestUncheckedUpdateInput
    >,
    private readonly monsterService: MonsterService
  ) {
    super(repository);
  }

  protected notFoundError(id: string): Error {
    return new QuestNotFoundError(id);
  }

  protected override async validateCreate(data: Prisma.QuestUncheckedCreateInput): Promise<void> {
    this.validateTitle(data.title);
    this.validateReward(data.reward);
    await this.ensureMonsterExists(data.monsterId);
  }

  protected override async validateUpdate(data: Prisma.QuestUncheckedUpdateInput): Promise<void> {
    if (typeof data.reward === 'number') {
      this.validateReward(data.reward);
    }
    if (typeof data.monsterId === 'string') {
      await this.ensureMonsterExists(data.monsterId);
    }
  }

  private validateTitle(title: string): void {
    if (!title || title.trim().length === 0) {
      throw new QuestValidationError('Quest title is required');
    }
  }

  private validateReward(reward?: number | null): void {
    if (typeof reward === 'number' && reward < 0) {
      throw new QuestValidationError('Quest reward must be >= 0');
    }
  }

  private async ensureMonsterExists(monsterId: string): Promise<void> {
    try {
      await this.monsterService.ensureExists(monsterId);
    } catch {
      throw new QuestValidationError(`Monster with id ${monsterId} does not exist`);
    }
  }
}
