import { Router } from 'express';
import { validate } from '../middlewares/validate.middleware';
import { HunterCreateSchema, HunterUpdateSchema } from '../schemas/hunter.schemas';
import { hunterController } from '../app/dependencies';

const router = Router();

router.post('/', validate(HunterCreateSchema), hunterController.create);
router.get('/', hunterController.findAll);
router.get('/:id', hunterController.findById);
router.put('/:id', validate(HunterUpdateSchema), hunterController.update);
router.delete('/:id', hunterController.delete);

export default router;
