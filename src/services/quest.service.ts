import type { Quest } from '../generated/prisma/client';
import type { QuestRepository } from '../repositories/quest.repository';

export class QuestNotFoundError extends Error {
  constructor(id: string) {
    super(`Quest with id ${id} was not found`);
    this.name = 'QuestNotFoundError';
  }
}

export class QuestService {
  constructor(private readonly questRepository: QuestRepository) {}

  async findById(id: string): Promise<Quest> {
    return await this.ensureExists(id);
  }

  async findAll(): Promise<Quest[]> {
    return await this.questRepository.findAll();
  }

  private async ensureExists(id: string): Promise<Quest> {
    const quest = await this.questRepository.findById(id);
    if (!quest) {
      throw new QuestNotFoundError(id);
    }
    return quest;
  }
}
