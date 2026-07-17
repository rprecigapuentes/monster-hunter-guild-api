import type { IEntityStatistics } from './entity-statistics.interface';

export class StatisticNotFoundError extends Error {
  constructor(statistic: string, entity: string) {
    super(`Statistic '${statistic}' not found for entity '${entity}'`);
    this.name = 'StatisticNotFoundError';
  }
}

export abstract class BaseStatisticsService implements IEntityStatistics {
  abstract readonly entity: string;

  protected readonly statistics = new Map<string, () => Promise<unknown>>();

  async getStatistics() {
    const result: Record<string, unknown> = {};

    for (const [key, fn] of this.statistics) {
      result[key] = await fn();
    }

    return result;
  }

  async getStatistic(name: string) {
    const statistic = this.statistics.get(name);

    if (!statistic) {
      throw new StatisticNotFoundError(name, this.entity);
    }

    return statistic();
  }
}
