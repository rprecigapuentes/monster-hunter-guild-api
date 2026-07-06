import { Router } from 'express';
import { GuildController } from '../controllers/Guild.controller';
import { GuildService } from '../services/guild.service';
import { GuildRepository } from '../repositories/guild.repository';
import { prisma } from '../lib/prisma';
import { validate } from '../middlewares/validate.middleware';
import { GuildCreateInputSchema, GuildUpdateInputSchema } from '../generated/zod';

const router = Router();

const guildRepository = new GuildRepository(prisma.guild);
const guildService = new GuildService(guildRepository);
const guildController = new GuildController(guildService);

router.post('/', validate(GuildCreateInputSchema), guildController.create);
router.get('/', guildController.findAll);
router.get('/:id', guildController.findById);
router.put('/:id', validate(GuildUpdateInputSchema), guildController.update);
router.delete('/:id', guildController.delete);

export default router;
