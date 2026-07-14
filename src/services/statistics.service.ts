import type {
  StatisticsDto,
  EntityCountsDto,
  CompletedQuestsCountDto,
  HunterLeaderboardDto,
} from '../dto/statistics.dto';
import type { IQuestRepository } from '../repositories/interfaces/quest-repository.interface';
import type { IHunterRepository } from '../repositories/interfaces/hunter-repository.interface';
import type { ICountable } from '../repositories/interfaces/countable.interface';

interface StatisticsServiceDependencies {
  questRepository: IQuestRepository;
  hunterRepository: IHunterRepository;
  guildRepository: ICountable;
  monsterRepository: ICountable;
}

export class StatisticsService {
  private readonly questRepository: IQuestRepository;
  private readonly hunterRepository: IHunterRepository;
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

  async getCompletedQuestsCount(): Promise<CompletedQuestsCountDto> {
    const completedQuests = await this.questRepository.countCompletedQuests();
    return { completedQuests };
  }

  async getHunterLeaderboard(): Promise<HunterLeaderboardDto> {
    const hunters = await this.hunterRepository.hunterLeaderboard();

    const leaderboard = hunters.map((hunter) => ({
      id: hunter.id,
      name: hunter.name,
      rank: hunter.rank,
      experiencePoints: hunter.experiencePoints,
      guildId: hunter.guildId,
    }));

    return { leaderboard };
  }
}
