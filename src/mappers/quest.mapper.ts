import type { Quest as PrismaQuest } from '../generated/prisma/client';
import { Quest } from '../entities/Quest';

export function toQuestEntity(data: PrismaQuest): Quest {
  return new Quest({
    id: data.id,
    title: data.title,
    location: data.location,
    reward: data.reward,
    status: data.status,
    monsterId: data.monsterId,
  });
}
