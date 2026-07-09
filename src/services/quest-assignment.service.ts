import type { Prisma, QuestAssignment, QuestRole } from '../generated/prisma/client';
import type { IBasicRepository } from '../repositories/interfaces/basic-repository.interface';
import type { HunterService } from './hunter.service';
import type { QuestService } from './quest.service';
import { BaseService } from './base-service.abstract';

export class QuestAssignmentNotFoundError extends Error {
  constructor(id: string) {
    super(`QuestAssignment with id ${id} was not found`);
    this.name = 'QuestAssignmentNotFoundError';
  }
}

export class QuestAssignmentValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'QuestAssignmentValidationError';
  }
}

export class QuestAssignmentService extends BaseService<
  QuestAssignment,
  Prisma.QuestAssignmentUncheckedCreateInput,
  Prisma.QuestAssignmentUncheckedUpdateInput
> {
  private readonly _validRoles: QuestRole[] = ['Leader', 'Support', 'Scout'];

  constructor(
    repository: IBasicRepository<
      QuestAssignment,
      Prisma.QuestAssignmentUncheckedCreateInput,
      Prisma.QuestAssignmentUncheckedUpdateInput
    >,
    private readonly questService: QuestService,
    private readonly hunterService: HunterService
  ) {
    super(repository);
  }

  protected notFoundError(id: string): Error {
    return new QuestAssignmentNotFoundError(id);
  }

  protected override async validateCreate(
    data: Prisma.QuestAssignmentUncheckedCreateInput
  ): Promise<void> {
    const { hunterId, questId, role } = data;

    this.validateRole(role);
    await this.ensureQuestExists(questId);
    await this.ensureHunterExists(hunterId);

    const questAssignments = await this.findAssignmentsByQuest(questId);
    this.ensureHunterNotAlreadyAssigned(questAssignments, hunterId);
    this.ensureQuestHasNoLeaderYet(questAssignments, role as QuestRole);
  }

  protected override async validateUpdate(
    existing: QuestAssignment,
    data: Prisma.QuestAssignmentUncheckedUpdateInput
  ): Promise<void> {
    const hunterId = typeof data.hunterId === 'string' ? data.hunterId : existing.hunterId;
    const questId = typeof data.questId === 'string' ? data.questId : existing.questId;
    const role = (data.role ?? existing.role) as QuestRole;

    if (data.role !== undefined) {
      this.validateRole(role);
    }
    if (typeof data.hunterId === 'string') {
      await this.ensureHunterExists(hunterId);
    }
    if (typeof data.questId === 'string') {
      await this.ensureQuestExists(questId);
    }

    const others = (await this.findAssignmentsByQuest(questId)).filter(
      (assignment) => assignment.id !== existing.id
    );
    this.ensureHunterNotAlreadyAssigned(others, hunterId);
    this.ensureQuestHasNoLeaderYet(others, role);
  }

  private validateRole(role: unknown): void {
    if (!this._validRoles.includes(role as QuestRole)) {
      throw new QuestAssignmentValidationError(
        `Role must be one of: ${this._validRoles.join(', ')}`
      );
    }
  }

  private async ensureQuestExists(questId: string): Promise<void> {
    try {
      await this.questService.ensureExists(questId);
    } catch {
      throw new QuestAssignmentValidationError(`Quest with id ${questId} does not exist`);
    }
  }

  private async ensureHunterExists(hunterId: string): Promise<void> {
    try {
      await this.hunterService.ensureExists(hunterId);
    } catch {
      throw new QuestAssignmentValidationError(`Hunter with id ${hunterId} does not exist`);
    }
  }

  async findByQuest(questId: string): Promise<QuestAssignment[]> {
    return this.findAssignmentsByQuest(questId);
  }

  private async findAssignmentsByQuest(questId: string): Promise<QuestAssignment[]> {
    const all = await this.repository.findAll();
    return all.filter((assignment) => assignment.questId === questId);
  }

  private ensureHunterNotAlreadyAssigned(
    questAssignments: QuestAssignment[],
    hunterId: string
  ): void {
    if (questAssignments.some((assignment) => assignment.hunterId === hunterId)) {
      throw new QuestAssignmentValidationError('Hunter is already assigned to this quest');
    }
  }

  private ensureQuestHasNoLeaderYet(questAssignments: QuestAssignment[], role: QuestRole): void {
    if (role === 'Leader' && questAssignments.some((a) => a.role === 'Leader')) {
      throw new QuestAssignmentValidationError('Quest already has a Leader');
    }
  }
}
