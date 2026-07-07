import { Router } from 'express';
import { HunterRepository } from '../repositories/hunter.repository';
import { HunterService } from '../services/hunter.service';
import { HunterController } from '../controllers/hunter.controller';
import { prisma } from '../lib/prisma';
import { validate } from '../middlewares/validate.middleware';
import { HunterCreateInputSchema, HunterUpdateInputSchema } from '../generated/zod';
import { RankCalculator } from '../services/rank-calculator';

const router = Router();
const hunterRepository = new HunterRepository(prisma.hunter);
const rankCalculator = new RankCalculator();
const hunterService = new HunterService(hunterRepository, rankCalculator);
const hunterController = new HunterController(hunterService);

router.post('/', validate(HunterCreateInputSchema), hunterController.create);
router.get('/', hunterController.findAll);
router.get('/:id', hunterController.findById);
router.put('/:id', validate(HunterUpdateInputSchema), hunterController.update);
router.delete('/:id', hunterController.delete);

export default router;
