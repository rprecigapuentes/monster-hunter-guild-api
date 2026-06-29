import type { Hunter as PrismaHunter } from '../generated/prisma/client';
import { Hunter } from '../entities/Hunter';

export function toHunterEntity(data: PrismaHunter): Hunter {
  return new Hunter({
    id: data.id,
    name: data.name,
    rank: data.rank,
    experiencePoints: data.experiencePoints,
    guildId: data.guildId,
  });
}
