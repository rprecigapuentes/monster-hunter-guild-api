import { Router } from 'express';
import { validate } from '../middlewares/validate.middleware';
import { HunterCreateInputSchema, HunterUpdateInputSchema } from '../generated/zod';
import { hunterController } from '../app/dependencies';

const router = Router();
import { RankCalculator } from '../services/rank-calculator';

const rankCalculator = new RankCalculator()


router.post('/', validate(HunterCreateInputSchema), hunterController.create);
router.get('/', hunterController.findAll);
router.get('/:id', hunterController.findById);
router.put('/:id', validate(HunterUpdateInputSchema), hunterController.update);
router.delete('/:id', hunterController.delete);

export default router;
