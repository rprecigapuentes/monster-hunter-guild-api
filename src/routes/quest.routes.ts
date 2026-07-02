import { Router } from 'express';
import { QuestController } from '../controllers/Quest.controller';
import { QuestService } from '../services/quest.service';
import { QuestRepository } from '../repositories/quest.repository';
import { MonsterRepository } from '../repositories/monster.repository';
import { prisma } from '../lib/prisma';

const router = Router();

const questRepository = new QuestRepository(prisma.quest);
const monsterRepository = new MonsterRepository(prisma.monster);
const questService = new QuestService(questRepository, monsterRepository);
const questController = new QuestController(questService);

router.post('/', questController.create);
router.get('/', questController.findAll);
router.get('/:id', questController.findById);
router.put('/:id', questController.update);
router.delete('/:id', questController.delete);

export default router;
