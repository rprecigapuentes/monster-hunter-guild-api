import { BaseStatisticsService } from './base-statistics.service';
import type { IHunterRepository } from '../../repositories/interfaces/hunter-repository.interface';

export class HunterStatisticsService extends BaseStatisticsService {
  readonly entity = 'hunters';

  constructor(repository: IHunterRepository) {
    super();

    this.statistics.set('count', () => repository.count());

    this.statistics.set('leaderboard', () => repository.hunterLeaderboard());
  }
}
