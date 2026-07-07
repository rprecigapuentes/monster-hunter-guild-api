import { Router } from 'express';
import { MonsterController } from '../controllers/monster.controller';
import { MonsterRepository } from '../repositories/monster.repository';
import { MonsterService } from '../services/monster.service';
import { prisma } from '../lib/prisma';
import { validate } from '../middlewares/validate.middleware';
import { MonsterCreateInputSchema, MonsterUpdateInputSchema } from '../generated/zod';

const router = Router();

const monsterRepository = new MonsterRepository(prisma.monster);
export const monsterService = new MonsterService(monsterRepository);
const monsterController = new MonsterController(monsterService);

router.post('/', validate(MonsterCreateInputSchema), monsterController.create);
router.get('/', monsterController.findAll);
router.get('/:id', monsterController.findById);
router.put('/:id', validate(MonsterUpdateInputSchema), monsterController.update);
router.delete('/:id', monsterController.delete);

export default router;
