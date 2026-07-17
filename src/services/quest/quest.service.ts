import { type EventManager } from '../../events/event-manager';
import type { Prisma, Quest, QuestStatus } from '../../generated/prisma/client';
import type { IBasicRepository } from '../../repositories/interfaces/basic-repository.interface';
import { BaseService } from '../base-service.abstract';
import type { EntityExistenceValidator } from '../entity-existence-validator';
import { type QuestStateFactory } from './quest-state-factory';
import { NotFoundError, ValidationError, ConflictError } from '../../errors';

export class QuestNotFoundError extends NotFoundError {
  constructor(id: string) {
    super(`Quest with id ${id} was not found`);
  }
}

export class QuestValidationError extends ValidationError {
  constructor(message: string) {
    super(message);
  }
}

export class QuestTransitionError extends ConflictError {
  constructor(message: string) {
    super(message);
  }
}

interface QuestServiceDependencies {
  repository: IBasicRepository<
    Quest,
    Prisma.QuestUncheckedCreateInput,
    Prisma.QuestUncheckedUpdateInput
  >;
  monsterExistence: EntityExistenceValidator;
  stateFactory: QuestStateFactory;
  events: EventManager;
}

export class QuestService extends BaseService<
  Quest,
  Prisma.QuestUncheckedCreateInput,
  Prisma.QuestUncheckedUpdateInput
> {
  private readonly monsterExistence: EntityExistenceValidator;
  private readonly stateFactory: QuestStateFactory;

  constructor(deps: QuestServiceDependencies) {
    super(deps.repository, deps.events);
    this.monsterExistence = deps.monsterExistence;
    this.stateFactory = deps.stateFactory;
  }

  protected get entityName(): string {
    return 'Quest';
  }

  protected notFoundError(id: string): Error {
    return new QuestNotFoundError(id);
  }

  override async update(id: string, data: Prisma.QuestUncheckedUpdateInput): Promise<Quest> {
    const existingQuest = await this.ensureExists(id);
    await this.validateUpdate(existingQuest, data);
    const updatedQuest = await this.repository.update(id, data);

    if (data.status && existingQuest.status !== data.status) {
      const targetState = this.stateFactory.getState(data.status as QuestStatus);
      await targetState.onEnter(existingQuest);
    }

    await this.events.notify('entity.updated', {
      operation: 'UPDATED',
      entity: 'Quest',
      entityId: updatedQuest.id,
    });

    return updatedQuest;
  }

  protected override async validateCreate(data: Prisma.QuestUncheckedCreateInput): Promise<void> {
    const { title, reward, status, monsterId } = data;
    this.validateTitle(title);
    this.validateReward(reward);
    if (status && status !== 'PENDING') {
      throw new QuestValidationError('A quest must be created with "PENDING" status.');
    }
    await this.monsterExistence.ensure(monsterId);
  }

  protected override async validateUpdate(
    existing: Quest,
    data: Prisma.QuestUncheckedUpdateInput
  ): Promise<void> {
    const { status: currentStatus } = existing;
    const { monsterId, reward, status: nextStatus } = data;
    const parsedNextStatus = nextStatus as QuestStatus;

    if (typeof monsterId === 'string') {
      await this.monsterExistence.ensure(monsterId);
    }
    if (typeof reward === 'number') {
      this.validateReward(reward);
    }

    if (parsedNextStatus && currentStatus !== parsedNextStatus) {
      const currentState = this.stateFactory.getState(currentStatus);
      const allowedTransitions = currentState.getValidTransitions();

    if (!allowedTransitions.includes(parsedNextStatus)) {
      throw new QuestTransitionError(
        `Provided status: ${currentStatus} can not be changed to ${parsedNextStatus}`
      );
    }

      const targetState = this.stateFactory.getState(parsedNextStatus);
      await targetState.validateBefore(existing);
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
}
