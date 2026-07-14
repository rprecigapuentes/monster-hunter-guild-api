import { z } from 'zod';

export const HunterCreateSchema = z
  .object({
    name: z.string().min(1),
    guildId: z.string().uuid(),
  })
  .strict();

export const HunterUpdateSchema = z
  .object({
    name: z.string().min(1).optional(),
    guildId: z.string().uuid().optional(),
  })
  .strict();
