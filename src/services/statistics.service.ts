import type { StatisticsDto, EntityCountsDto } from '../dto/statistics.dto';
import type { IQuestRepository } from '../repositories/interfaces/quest-repository.interface';
import type { ICountable } from '../repositories/interfaces/countable.interface';

interface StatisticsServiceDependencies {
  questRepository: IQuestRepository;
  hunterRepository: ICountable;
  guildRepository: ICountable;
  monsterRepository: ICountable;
}

export class StatisticsService {
  private readonly questRepository: IQuestRepository;
  private readonly hunterRepository: ICountable;
  private readonly guildRepository: ICountable;
  private readonly monsterRepository: ICountable;

  constructor(deps: StatisticsServiceDependencies) {
    this.questRepository = deps.questRepository;
    this.hunterRepository = deps.hunterRepository;
    this.guildRepository = deps.guildRepository;
    this.monsterRepository = deps.monsterRepository;
  }

  async getQuestAverageReward(): Promise<StatisticsDto> {
    const averageReward = await this.questRepository.averageReward();
    return { averageReward };
  }

  async getEntitiesCount(): Promise<EntityCountsDto> {
    const quests = await this.questRepository.count();
    const hunters = await this.hunterRepository.count();
    const guilds = await this.guildRepository.count();
    const monsters = await this.monsterRepository.count();

    return { quests, hunters, guilds, monsters };
  }

  async getCompletedQuestsCount(): Promise<number> {
    return this.questRepository.countCompletedQuests();
  }
}
