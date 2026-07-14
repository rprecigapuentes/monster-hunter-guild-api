import type { StatisticsDto } from '../dto/statistics.dto';
import type { IQuestRepository } from '../repositories/interfaces/quest-repository.interface';

export class StatisticsService {
  constructor(private readonly questRepository: IQuestRepository) {}

  async getAverageReward(): Promise<StatisticsDto> {
    const averageReward = await this.questRepository.averageReward();
    return { averageReward };
  }
}
