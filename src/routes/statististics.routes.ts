import { Router } from 'express';
import { statisticsController } from '../app/dependencies';

const router = Router();

router.get('/quest-average-reward', statisticsController.questAverageReward);
router.get('/entities-count', statisticsController.entitiesCount);
router.get('/completed-quests-count', statisticsController.completedQuestsCount);

export default router;
