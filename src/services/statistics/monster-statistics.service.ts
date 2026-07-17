import { BaseStatisticsService } from './base-statistics.service';
import type { ICountable } from '../../repositories/interfaces/countable.interface';

export class MonsterStatisticsService extends BaseStatisticsService {
  readonly entity = 'monsters';

  constructor(repository: ICountable) {
    super();

    this.statistics.set('count', () => repository.count());
  }
}
