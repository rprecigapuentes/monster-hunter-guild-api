export interface IEntityStatistics {
  readonly entity: string;

  getStatistics(): Promise<Record<string, unknown>>;

  getStatistic(name: string): Promise<unknown>;
}
