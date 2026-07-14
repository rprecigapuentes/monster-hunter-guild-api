import { GuildController } from '../controllers/guild.controller';
import { HunterController } from '../controllers/hunter.controller';
import { MonsterController } from '../controllers/monster.controller';
import { QuestController } from '../controllers/quest.controller';
import { prisma } from '../lib/prisma';
import { GuildRepository } from '../repositories/guild.repository';
import { HunterRepository } from '../repositories/hunter.repository';
import { MonsterRepository } from '../repositories/monster.repository';
import { QuestRepository } from '../repositories/quest.repository';
import { GuildService } from '../services/guild.service';
import { HunterService } from '../services/hunter.service';
import { MonsterService } from '../services/monster.service';
import { QuestService } from '../services/quest.service';
import { RankCalculator } from '../services/rank-calculator';
import { QuestAssignmentService } from '../services/quest-assignment.service';
import { QuestAssignmentController } from '../controllers/quest-assignment.controller';
import { QuestAssignmentRepository } from '../repositories/quest-assignment.repository';
import { RewardDistributionService } from '../services/reward-distribution.service';
import { EntityExistenceValidator } from '../services/entity-existence-validator';
import { StatisticsService } from '../services/statistics.service';
import { StatisticsController } from '../controllers/statistics.controller';

// Monster
const monsterRepository = new MonsterRepository(prisma.monster);
const monsterService = new MonsterService(monsterRepository);
export const monsterController = new MonsterController(monsterService);
const monsterExistence = new EntityExistenceValidator(monsterService, 'Monster');

// Hunter
const rankCalculator = new RankCalculator();
const hunterRepository = new HunterRepository(prisma.hunter);
const hunterService = new HunterService(hunterRepository, rankCalculator);
export const hunterController = new HunterController(hunterService);
const hunterExistence = new EntityExistenceValidator(hunterService, 'Hunter');

// Quest
const questRepository = new QuestRepository(prisma.quest);
const questService = new QuestService({
  repository: questRepository,
  monsterExistence,
  getQuestAssignmentService: (): QuestAssignmentService => questAssignmentService,
  getRewardDistributionService: (): RewardDistributionService => rewardDistributionService,
});
export const questController = new QuestController(questService);
const questExistence = new EntityExistenceValidator(questService, 'Quest');

// Guild
const guildRepository = new GuildRepository(prisma.guild);
const guildService = new GuildService(guildRepository);
export const guildController = new GuildController(guildService);

//QuestAssignment
const questAssignmentRepository = new QuestAssignmentRepository(prisma.questAssignment);
const questAssignmentService = new QuestAssignmentService({
  repository: questAssignmentRepository,
  questExistence,
  hunterExistence,
});
export const questAssignmentController = new QuestAssignmentController(questAssignmentService);

const rewardDistributionService = new RewardDistributionService({
  hunterService,
  getQuestAssignmentService: (): QuestAssignmentService => questAssignmentService,
});

//Statistics
const statisticsService = new StatisticsService(questRepository);
export const statisticsController = new StatisticsController(statisticsService);
