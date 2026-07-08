import { Router } from 'express';
import { HunterRepository } from '../repositories/hunter.repository';
import { HunterService } from '../services/hunter.service';
import { HunterController } from '../controllers/hunter.controller';
import { prisma } from '../lib/prisma';
import { validate } from '../middlewares/validate.middleware';
import {
  HunterUncheckedCreateInputSchema,
  HunterUncheckedUpdateInputSchema,
} from '../generated/zod';
import { RankCalculator } from '../services/rank-calculator';

const router = Router();
const hunterRepository = new HunterRepository(prisma.hunter);
const rankCalculator = new RankCalculator();
export const hunterService = new HunterService(hunterRepository, rankCalculator);
const hunterController = new HunterController(hunterService);

router.post('/', validate(HunterUncheckedCreateInputSchema), hunterController.create);
router.get('/', hunterController.findAll);
router.get('/:id', hunterController.findById);
router.put('/:id', validate(HunterUncheckedUpdateInputSchema), hunterController.update);
router.delete('/:id', hunterController.delete);

export default router;
