import { Router } from 'express';
import { validate } from '../middlewares/validate.middleware';
import { GuildCreateInputSchema, GuildUpdateInputSchema } from '../generated/zod';
import { guildController } from '../app/dependencies';

const router = Router();

router.post('/', validate(GuildCreateInputSchema), guildController.create);
router.get('/', guildController.findAll);
router.get('/:id', guildController.findById);
router.put('/:id', validate(GuildUpdateInputSchema), guildController.update);
router.delete('/:id', guildController.delete);

export default router;
