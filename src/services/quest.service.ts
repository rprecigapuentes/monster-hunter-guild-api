import type { Prisma, Quest, QuestStatus } from '../generated/prisma/client';
import type { IBasicRepository } from '../repositories/interfaces/basic-repository.interface';
import type { QuestAssignmentService } from './quest-assignment.service';
import { BaseService } from './base-service.abstract';
import type { RewardDistributionService } from './reward-distribution.service';
import type { EntityExistenceValidator } from './entity-existence-validator';
import type { EventManager } from '../events/event-manager';

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

interface QuestServiceDependencies {
  repository: IBasicRepository<
    Quest,
    Prisma.QuestUncheckedCreateInput,
    Prisma.QuestUncheckedUpdateInput
  >;
  monsterExistence: EntityExistenceValidator;
  events: EventManager;
  getRewardDistributionService: () => RewardDistributionService;
  getQuestAssignmentService: () => QuestAssignmentService;
}

export class QuestService extends BaseService<
  Quest,
  Prisma.QuestUncheckedCreateInput,
  Prisma.QuestUncheckedUpdateInput
> {
  private readonly monsterExistence: EntityExistenceValidator;
  private readonly getRewardDistributionService: () => RewardDistributionService;
  private readonly getQuestAssignmentService: () => QuestAssignmentService;
  private readonly _validTransitions: Record<QuestStatus, QuestStatus[]> = {
    PENDING: ['IN_PROGRESS'],
    IN_PROGRESS: ['COMPLETED', 'FAILED'],
    COMPLETED: [],
    FAILED: ['PENDING'],
  };

  constructor(deps: QuestServiceDependencies) {
    super(deps.repository, deps.events);
    this.monsterExistence = deps.monsterExistence;
    this.getRewardDistributionService = deps.getRewardDistributionService;
    this.getQuestAssignmentService = deps.getQuestAssignmentService;
  }

  protected get entityName(): string {
    return 'Quest';
  }

  protected notFoundError(id: string): Error {
    return new QuestNotFoundError(id);
  }

  override async update(id: string, data: Prisma.QuestUncheckedUpdateInput): Promise<Quest> {
    const existingQuest = await this.ensureExists(id);
    const rewardDistributionService = this.getRewardDistributionService();
    await this.validateUpdate(existingQuest, data);
    const updatedQuest = await this.repository.update(id, data);

    if (data.status === 'COMPLETED') {
      await rewardDistributionService.distributeRewards(updatedQuest.id, updatedQuest.reward ?? 0);
      await this.events.notify('quest.completed', {
        operation: 'COMPLETED',
        entity: 'Quest',
        entityId: updatedQuest.id,
      });
    } else {
      await this.events.notify('entity.updated', {
        operation: 'UPDATED',
        entity: 'Quest',
        entityId: updatedQuest.id,
      });
    }

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

    if (typeof monsterId === 'string') {
      await this.monsterExistence.ensure(monsterId);
    }
    if (typeof reward === 'number') {
      this.validateReward(reward);
    }

    if (nextStatus && currentStatus !== nextStatus) {
      this.validateStatusTransition(currentStatus, nextStatus as QuestStatus);

      if ((nextStatus as QuestStatus) === 'IN_PROGRESS') {
        await this.ensureQuestHasLeader(existing.id);
      }
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

  private validateStatusTransition(currentStatus: QuestStatus, nextStatus: QuestStatus): void {
    const allowedNextStatuses = this._validTransitions[currentStatus];

    if (!allowedNextStatuses.includes(nextStatus)) {
      throw new QuestValidationError(
        `Provided status: ${currentStatus} can not be changed to ${nextStatus}`
      );
    }
  }

  private async ensureQuestHasLeader(questId: string): Promise<void> {
    const questAssignmentService = this.getQuestAssignmentService();
    const assignments = await questAssignmentService.findByQuest(questId);
    const hasLeader = assignments.some((assignment) => assignment.role === 'Leader');
    if (!hasLeader) {
      throw new QuestValidationError('A quest needs at least one leader before it can start');
    }
  }
}
