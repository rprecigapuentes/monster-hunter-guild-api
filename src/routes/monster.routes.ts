import { Router } from 'express';
import { MonsterController } from '../controllers/monster.controller';
import { MonsterRepository } from '../repositories/monster.repository';
import { MonsterService } from '../services/monster.service';
import { prisma } from '../lib/prisma';

const router = Router();

const monsterRepository = new MonsterRepository(prisma.monster);
export const monsterService = new MonsterService(monsterRepository);
const monsterController = new MonsterController(monsterService);

router.post('/', monsterController.create);
router.get('/', monsterController.findAll);
router.get('/:id', monsterController.findById);
router.put('/:id', monsterController.update);
router.delete('/:id', monsterController.delete);

export default router;
