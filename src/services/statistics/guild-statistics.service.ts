import { BaseStatisticsService } from './base-statistics.service';
import type { ICountable } from '../../repositories/interfaces/countable.interface';

export class GuildStatisticsService extends BaseStatisticsService {
  readonly entity = 'guilds';

  constructor(repository: ICountable) {
    super();

    this.statistics.set('count', () => repository.count());
  }
}
