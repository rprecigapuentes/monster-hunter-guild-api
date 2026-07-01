import type { Prisma, Quest } from '../generated/prisma/client';
import type { QuestRepository } from '../repositories/quest.repository';
import type { MonsterRepository } from '../repositories/monster.repository';

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

export class QuestService {
  constructor(
    private readonly questRepository: QuestRepository,
    private readonly monsterRepository: MonsterRepository
  ) {}

  async create(data: Prisma.QuestUncheckedCreateInput): Promise<Quest> {
    this.validateTitle(data.title);
    this.validateReward(data.reward);
    await this.ensureMonsterExists(data.monsterId);
    return await this.questRepository.create(data);
  }

  async update(id: string, data: Prisma.QuestUncheckedUpdateInput): Promise<Quest> {
    await this.ensureExists(id);
    if (typeof data.reward === 'number') {
      this.validateReward(data.reward);
    }
    if (typeof data.monsterId === 'string') {
      await this.ensureMonsterExists(data.monsterId);
    }
    return await this.questRepository.update(id, data);
  }

  async findById(id: string): Promise<Quest> {
    return await this.ensureExists(id);
  }

  async findAll(): Promise<Quest[]> {
    return await this.questRepository.findAll();
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
    const monster = await this.monsterRepository.findById(monsterId);
    if (!monster) {
      throw new QuestValidationError(`Monster with id ${monsterId} does not exist`);
    }
  }

  private async ensureExists(id: string): Promise<Quest> {
    const quest = await this.questRepository.findById(id);
    if (!quest) {
      throw new QuestNotFoundError(id);
    }
    return quest;
  }
}
