export interface StatisticsDto {
  averageReward: number;
}

export interface EntityCountsDto {
  quests: number;
  hunters: number;
  guilds: number;
  monsters: number;
}

export interface CompletedQuestsCountDto {
  completedQuests: number;
}

interface HunterDto {
  id: string;
  name: string;
  rank: number;
  experiencePoints: number;
  guildId: string | null;
}

export interface HunterLeaderboardDto {
  leaderboard: HunterDto[];
}
