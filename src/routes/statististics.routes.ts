import { Router } from 'express';
import { statisticsController } from '../app/dependencies';

const router = Router();

router.get('/global/:statistic', statisticsController.globalStatistic);
router.get('/:entity/:statistic', statisticsController.entityStatistic);
router.get('/:entity', statisticsController.entityStatistics);

export default router;
