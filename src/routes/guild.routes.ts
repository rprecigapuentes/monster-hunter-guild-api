import { Router } from 'express';
import { GuildController } from '../controllers/Guild.controller';
import { GuildService } from '../services/guild.service';
import { GuildRepository } from '../repositories/guild.repository';
import { prisma } from '../lib/prisma';

const router = Router();

const guildRepository = new GuildRepository(prisma.guild);
const guildService = new GuildService(guildRepository);
const guildController = new GuildController(guildService);

router.post('/', guildController.create);
router.get('/', guildController.findAll);
router.get('/:id', guildController.findById);
router.put('/:id', guildController.update);
router.delete('/:id', guildController.delete);

export default router;
