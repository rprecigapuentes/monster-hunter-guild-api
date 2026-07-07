import type { Prisma, Quest, QuestStatus } from '../generated/prisma/client';
import type { PrismaBaseRepository } from '../repositories/interfaces/prisma-base-repository.abstract';
import type { MonsterService } from './monster.service';
import { BaseService } from './base-service.abstract';

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

export class QuestService extends BaseService<
  Quest,
  Prisma.QuestUncheckedCreateInput,
  Prisma.QuestUncheckedUpdateInput
> {
  private _validTransitions: Record<QuestStatus, QuestStatus[]> = {
    PENDING: ['IN_PROGRESS'],
    IN_PROGRESS: ['COMPLETED', 'FAILED'],
    COMPLETED: [],
    FAILED: ['PENDING'],
  };
  constructor(
    repository: PrismaBaseRepository<
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

  protected override async validateUpdate(
    exsiting: Quest,
    data: Prisma.QuestUncheckedUpdateInput
  ): Promise<void> {
    const { status: currentStatus } = exsiting;
    const { monsterId, reward, status: nextStatus } = data;

    if (typeof monsterId === 'string') {
      await this.ensureMonsterExists(monsterId);
    }
    if (typeof reward === 'number') {
      this.validateReward(reward);
    }

    if (nextStatus && currentStatus !== nextStatus) {
      this.validateStatusTransition(currentStatus, nextStatus as QuestStatus);
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

  private validateStatusTransition(currentStatus: QuestStatus, nextStatus: QuestStatus): void {
    const allowedNextStatuses = this._validTransitions[currentStatus];

    if (!allowedNextStatuses.includes(nextStatus)) {
      throw new QuestValidationError(
        `Provided status: ${currentStatus} can not be changed to ${nextStatus}`
      );
    }
  }
}
