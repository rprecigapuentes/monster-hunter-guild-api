import { Router } from 'express';
import { monsterService } from './monster.routes';
import { QuestController } from '../controllers/quest.controller';
import { QuestService } from '../services/quest.service';
import { QuestRepository } from '../repositories/quest.repository';
import { prisma } from '../lib/prisma';

const router = Router();

const questRepository = new QuestRepository(prisma.quest);
const questService = new QuestService(questRepository, monsterService);
const questController = new QuestController(questService);

router.post('/', questController.create);
router.get('/', questController.findAll);
router.get('/:id', questController.findById);
router.put('/:id', questController.update);
router.delete('/:id', questController.delete);

export default router;
