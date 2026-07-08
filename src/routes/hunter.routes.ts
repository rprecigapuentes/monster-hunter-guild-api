import { Router } from 'express';
import { validate } from '../middlewares/validate.middleware';
<<<<<<< HEAD
import { HunterCreateInputSchema, HunterUpdateInputSchema } from '../generated/zod';
import { hunterController } from '../app/dependencies';
=======
import { HunterUncheckedCreateInputSchema, HunterUncheckedUpdateInputSchema } from '../generated/zod';
import { RankCalculator } from '../services/rank-calculator';
>>>>>>> 2e4de1b (refactor tests, service, controller and repository with HunterUnchechked)

const router = Router();
<<<<<<< HEAD
import { RankCalculator } from '../services/rank-calculator';

const rankCalculator = new RankCalculator()

=======
const hunterRepository = new HunterRepository(prisma.hunter);
const rankCalculator = new RankCalculator();
const hunterService = new HunterService(hunterRepository, rankCalculator);
const hunterController = new HunterController(hunterService);
>>>>>>> ee4d7d5 (fix lint problems)

router.post('/', validate(HunterUncheckedCreateInputSchema), hunterController.create);
router.get('/', hunterController.findAll);
router.get('/:id', hunterController.findById);
router.put('/:id', validate(HunterUncheckedUpdateInputSchema), hunterController.update);
router.delete('/:id', hunterController.delete);

export default router;
