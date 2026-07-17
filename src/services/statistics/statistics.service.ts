import type { IEntityStatistics } from './entity-statistics.interface';
import { StatisticNotFoundError } from './base-statistics.service';

export class EntityStatisticsNotFoundError extends Error {
  constructor(entity: string) {
    super(`${entity} statistics not found`);
    this.name = 'EntityStatisticsNotFoundError';
  }
}

export class GlobalStatisticNotFoundError extends Error {
  constructor(statistic: string) {
    super(`Statistic '${statistic}' not found for any entity`);
    this.name = 'GlobalStatisticNotFoundError';
  }
}

interface StatisticsFacadeDependencies {
  statistics: IEntityStatistics[];
}

export class StatisticsService {
  private readonly statistics = new Map<string, IEntityStatistics>();

  constructor(deps: StatisticsFacadeDependencies) {
    deps.statistics.forEach((statistic) => {
      this.statistics.set(statistic.entity, statistic);
    });
  }

  async getStatistics(entity: string) {
    const statistics = this.statistics.get(entity);

    if (!statistics) {
      throw new EntityStatisticsNotFoundError(entity);
    }

    return statistics.getStatistics();
  }

  async getStatistic(entity: string, statistic: string) {
    const statistics = this.statistics.get(entity);

    if (!statistics) {
      throw new EntityStatisticsNotFoundError(entity);
    }

    return statistics.getStatistic(statistic);
  }

  async getGlobalStatistic(statistic: string) {
    const NOT_FOUND = Symbol('not-found');

    const entries = await Promise.all(
      Array.from(this.statistics.values()).map(async (statistics) => {
        try {
          return [statistics.entity, await statistics.getStatistic(statistic)] as const;
        } catch (error) {
          if (error instanceof StatisticNotFoundError) {
            return [statistics.entity, NOT_FOUND] as const;
          }
          throw error;
        }
      })
    );

    const result = entries.reduce<Record<string, unknown>>((acc, [entity, value]) => {
      if (value !== NOT_FOUND) {
        acc[entity] = value;
      }
      return acc;
    }, {});

    if (Object.keys(result).length === 0) {
      throw new GlobalStatisticNotFoundError(statistic);
    }

    return result;
  }
}
