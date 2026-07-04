import { Router } from 'express';
import { HunterRepository } from '../repositories/hunter.repository';
import { HunterService } from '../services/hunter.service';
import { HunterController } from '../controllers/hunter.controller';
import { prisma } from '../lib/prisma';

const router = Router();

const hunterRepository = new HunterRepository(prisma.hunter);
const hunterService = new HunterService(hunterRepository);
const hunterController = new HunterController(hunterService);

router.post('/', hunterController.create);
router.get('/', hunterController.findAll);
router.get('/:id', hunterController.findById);
router.put('/:id', hunterController.update);
router.delete('/:id', hunterController.delete);

export default router;
