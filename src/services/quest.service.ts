import type { Prisma, Quest, QuestStatus } from '../generated/prisma/client';
import type { PrismaBaseRepository } from '../repositories/interfaces/prisma-base-repository.abstract';
import type { MonsterService } from './monster.service';
import type { QuestAssignmentService } from './quest-assignment.service';
import { BaseService } from './base-service.abstract';
import type { RewardDistributionService } from './reward-distribution.service';

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
  private readonly _validTransitions: Record<QuestStatus, QuestStatus[]> = {
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

  private rewardDistributionService?: RewardDistributionService;
  private questAssignmentService?: QuestAssignmentService;

  setQuestAssignmentService(service: QuestAssignmentService): void {
    this.questAssignmentService = service;
  }

  setRewardDistributionService(service: RewardDistributionService): void {
    this.rewardDistributionService = service;
  }

  protected notFoundError(id: string): Error {
    return new QuestNotFoundError(id);
  }

  override async update(id: string, data: Prisma.QuestUncheckedUpdateInput): Promise<Quest> {
    const existingQuest = await this.ensureExists(id);
    await this.validateUpdate(existingQuest, data);
    const updatedQuest = await this.repository.update(id, data);

    if (data.status === 'COMPLETED') {
      await this.rewardDistributionService!.distributeRewards(
        updatedQuest.id,
        updatedQuest.reward ?? 0
      );
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
    await this.ensureMonsterExists(monsterId);
  }

  protected override async validateUpdate(
    existing: Quest,
    data: Prisma.QuestUncheckedUpdateInput
  ): Promise<void> {
    const { status: currentStatus } = existing;
    const { monsterId, reward, status: nextStatus } = data;

    if (typeof monsterId === 'string') {
      await this.ensureMonsterExists(monsterId);
    }
    if (typeof reward === 'number') {
      this.validateReward(reward);
    }

    if (nextStatus && currentStatus !== nextStatus) {
      this.validateStatusTransition(currentStatus, nextStatus as QuestStatus);

      if ((nextStatus as QuestStatus) === 'IN_PROGRESS') {
        await this.ensureQuestHasHunters(existing.id);
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

  private async ensureQuestHasHunters(questId: string): Promise<void> {
    if (!this.questAssignmentService) {
      throw new Error('QuestAssignmentService is not wired into QuestService');
    }
    const assignments = await this.questAssignmentService.findByQuest(questId);
    if (assignments.length === 0) {
      throw new QuestValidationError('A quest needs at least one hunter before it can start');
    }
  }
}
