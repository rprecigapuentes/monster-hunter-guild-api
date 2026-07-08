import { Router } from 'express';
import { validate } from '../middlewares/validate.middleware';
import { MonsterCreateInputSchema, MonsterUpdateInputSchema } from '../generated/zod';
import { monsterController } from '../app/dependencies';

const router = Router();

router.post('/', validate(MonsterCreateInputSchema), monsterController.create);
router.get('/', monsterController.findAll);
router.get('/:id', monsterController.findById);
router.put('/:id', validate(MonsterUpdateInputSchema), monsterController.update);
router.delete('/:id', monsterController.delete);

export default router;
