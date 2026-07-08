import { Router } from 'express';
import { validate } from '../middlewares/validate.middleware';
import {
  HunterUncheckedCreateInputSchema,
  HunterUncheckedUpdateInputSchema,
} from '../generated/zod';
import { hunterController } from '../app/dependencies';

const router = Router();

router.post('/', validate(HunterUncheckedCreateInputSchema), hunterController.create);
router.get('/', hunterController.findAll);
router.get('/:id', hunterController.findById);
router.put('/:id', validate(HunterUncheckedUpdateInputSchema), hunterController.update);
router.delete('/:id', hunterController.delete);

export default router;
