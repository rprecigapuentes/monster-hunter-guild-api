import { Router } from 'express';
import { auditController } from '../app/dependencies';

const router = Router();

router.get('/', auditController.findAll);
router.get('/:id', auditController.findById);

export default router;
