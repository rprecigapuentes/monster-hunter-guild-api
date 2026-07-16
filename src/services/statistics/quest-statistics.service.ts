import { BaseStatisticsService } from './base-statistics.service';
import type { IQuestRepository } from '../../repositories/interfaces/quest-repository.interface';

export class QuestStatisticsService extends BaseStatisticsService {
  readonly entity = 'quests';

  constructor(private readonly repository: IQuestRepository) {
    super();

    this.statistics.set('count', () => repository.count());

    this.statistics.set('averageReward', () => repository.averageReward());

    this.statistics.set('completed', () => repository.countCompletedQuests());
  }
}
