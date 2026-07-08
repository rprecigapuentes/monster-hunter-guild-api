import { Router } from 'express';
import { validate } from '../middlewares/validate.middleware';
import {
  QuestAssignmentUncheckedCreateInputSchema,
  QuestAssignmentUncheckedUpdateInputSchema,
} from '../generated/zod';
import { questAssignmentController } from '../app/dependencies';

const router = Router();

router.post(
  '/',
  validate(QuestAssignmentUncheckedCreateInputSchema),
  questAssignmentController.create
);
router.get('/', questAssignmentController.findAll);
router.get('/:id', questAssignmentController.findById);
router.put(
  '/:id',
  validate(QuestAssignmentUncheckedUpdateInputSchema),
  questAssignmentController.update
);
router.delete('/:id', questAssignmentController.delete);

export default router;
