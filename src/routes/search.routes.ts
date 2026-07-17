import { Router } from 'express';
import { searchController } from '../app/dependencies';

const router = Router();

router.get('/', searchController.globalSearch);

export default router;
