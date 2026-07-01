import { Router } from 'express';
import { QuestController } from '../controllers/Quest.controller';
import { QuestService } from '../services/quest.service';
import { QuestRepository } from '../repositories/quest.repository';

const router = Router();

const questRepository = new QuestRepository();
const questService = new QuestService(questRepository);
const questController = new QuestController(questService);

router.get('/', questController.findAll);
router.get('/:id', questController.findById);

export default router;
