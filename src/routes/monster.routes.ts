import { Router } from 'express';
import { MonsterController } from '../controllers/monster.controller';

const router = Router();

const monsterController = new MonsterController();

router.post('/', monsterController.create);
router.get('/', monsterController.findAll);
router.get('/:id', monsterController.findById);
router.put('/:id', monsterController.update);
router.delete('/:id', monsterController.delete);

export default router;
