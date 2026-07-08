import { Router } from 'express';
import { hunterService } from './hunter.routes';
import { questService } from './quest.routes';
import { QuestAssignmentController } from '../controllers/quest-assignment.controller';
import { QuestAssignmentService } from '../services/quest-assignment.service';
import { QuestAssignmentRepository } from '../repositories/quest-assignment.repository';
import { prisma } from '../lib/prisma';
import { validate } from '../middlewares/validate.middleware';
import {
  QuestAssignmentUncheckedCreateInputSchema,
  QuestAssignmentUncheckedUpdateInputSchema,
} from '../generated/zod';
import { RewardDistributionService } from '../services/reward-distribution.service';

const router = Router();

const questAssignmentRepository = new QuestAssignmentRepository(prisma.questAssignment);
export const questAssignmentService = new QuestAssignmentService(
  questAssignmentRepository,
  questService,
  hunterService
);
questService.setQuestAssignmentService(questAssignmentService);

const rewardDistributionService = new RewardDistributionService(
  hunterService,
  questAssignmentService
);
questService.setRewardDistributionService(rewardDistributionService);

const questAssignmentController = new QuestAssignmentController(questAssignmentService);

router.post(
  '/',
  validate(QuestAssignmentUncheckedCreateInputSchema),
  questAssignmentController.create
);
router.get('/', questAssignmentController.findAll);
router.get('/:id', questAssignmentController.findById);
router.put(
  '/:id',
  validate(QuestAssignmentUncheckedUpdateInputSchema),
  questAssignmentController.update
);
router.delete('/:id', questAssignmentController.delete);

export default router;
