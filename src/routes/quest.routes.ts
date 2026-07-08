import { Router } from 'express';
import { validate } from '../middlewares/validate.middleware';
import { QuestUncheckedCreateInputSchema, QuestUncheckedUpdateInputSchema } from '../generated/zod';
import { questController } from '../app/dependencies';

const router = Router();

router.post('/', validate(QuestUncheckedCreateInputSchema), questController.create);
router.get('/', questController.findAll);
router.get('/:id', questController.findById);
router.put('/:id', validate(QuestUncheckedUpdateInputSchema), questController.update);
router.delete('/:id', questController.delete);

export default router;
