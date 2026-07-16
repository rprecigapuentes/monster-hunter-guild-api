import { GuildController } from '../controllers/guild.controller';
import { HunterController } from '../controllers/hunter.controller';
import { MonsterController } from '../controllers/monster.controller';
import { QuestController } from '../controllers/quest.controller';
import { prisma } from '../lib/prisma';
import { GuildRepository } from '../repositories/guild.repository';
import { HunterRepository } from '../repositories/hunter.repository';
import { MonsterRepository } from '../repositories/monster.repository';
import { QuestRepository } from '../repositories/quest.repository';
import { AuditRepository } from '../repositories/audit.repository';
import { GuildService } from '../services/guild.service';
import { HunterService } from '../services/hunter.service';
import { MonsterService } from '../services/monster.service';
import { QuestService } from '../services/quest/quest.service';
import { QuestAssignmentService } from '../services/quest-assignment.service';
import { QuestAssignmentController } from '../controllers/quest-assignment.controller';
import { QuestAssignmentRepository } from '../repositories/quest-assignment.repository';
import { RewardDistributionService } from '../services/reward-distribution.service';
import { EntityExistenceValidator } from '../services/entity-existence-validator';
import { QuestStateFactory } from '../services/quest/quest-state-factory';
import { EventManager } from '../events/event-manager';
import { AuditObserver } from '../events/observers/audit.observer';
import { AuditService } from '../services/audit.service';
import { AuditController } from '../controllers/audit.controller';

// EventManager

const events = new EventManager();

// Audit

const auditRepository = new AuditRepository(prisma.auditLog);
const auditObserver = new AuditObserver(auditRepository);
events.subscribe('*', auditObserver);

const auditService = new AuditService(auditRepository);
export const auditController = new AuditController(auditService);
import { DefaultRewardDistributionStrategy } from '../strategies/reward/default-reward-distribution.strategy';
import { DefaultRankCalculationStrategy } from '../strategies/rank/default-rank-calculation.strategy';

// Monster
const monsterRepository = new MonsterRepository(prisma.monster);
const monsterService = new MonsterService(monsterRepository, events);
export const monsterController = new MonsterController(monsterService);
const monsterExistence = new EntityExistenceValidator(monsterService, 'Monster');

// Hunter
const rankStrategy = new DefaultRankCalculationStrategy();
const hunterRepository = new HunterRepository(prisma.hunter);
const hunterService = new HunterService(hunterRepository, rankStrategy, events);
export const hunterController = new HunterController(hunterService);
const hunterExistence = new EntityExistenceValidator(hunterService, 'Hunter');

// Quest
const questRepository = new QuestRepository(prisma.quest);
const questStateFactory = new QuestStateFactory({
  getQuestAssignmentService: (): QuestAssignmentService => questAssignmentService,
  getRewardDistributionService: (): RewardDistributionService => rewardDistributionService,
  eventManager: events,
});
const questService = new QuestService({
  repository: questRepository,
  monsterExistence,
  events,
  stateFactory: questStateFactory,
});
export const questController = new QuestController(questService);
const questExistence = new EntityExistenceValidator(questService, 'Quest');

// Guild
const guildRepository = new GuildRepository(prisma.guild);
const guildService = new GuildService(guildRepository, events);
export const guildController = new GuildController(guildService);

// QuestAssignment
const questAssignmentRepository = new QuestAssignmentRepository(prisma.questAssignment);
const questAssignmentService = new QuestAssignmentService({
  repository: questAssignmentRepository,
  questExistence,
  hunterExistence,
  events,
});
export const questAssignmentController = new QuestAssignmentController(questAssignmentService);

// Reward Distribution
const defaultRewardDistributionStrategy = new DefaultRewardDistributionStrategy();
const rewardDistributionService = new RewardDistributionService({
  hunterService,
  getQuestAssignmentService: (): QuestAssignmentService => questAssignmentService,
  strategy: defaultRewardDistributionStrategy,
});