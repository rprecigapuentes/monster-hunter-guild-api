import { Router } from 'express';
import { monsterService } from './monster.routes';
import { QuestController } from '../controllers/quest.controller';
import { QuestService } from '../services/quest.service';
import { QuestRepository } from '../repositories/quest.repository';
import { prisma } from '../lib/prisma';
import { validate } from '../middlewares/validate.middleware';
import { QuestUncheckedCreateInputSchema, QuestUncheckedUpdateInputSchema } from '../generated/zod';

const router = Router();

const questRepository = new QuestRepository(prisma.quest);
export const questService = new QuestService(questRepository, monsterService);
const questController = new QuestController(questService);

router.post('/', validate(QuestUncheckedCreateInputSchema), questController.create);
router.get('/', questController.findAll);
router.get('/:id', questController.findById);
router.put('/:id', validate(QuestUncheckedUpdateInputSchema), questController.update);
router.delete('/:id', questController.delete);

export default router;
