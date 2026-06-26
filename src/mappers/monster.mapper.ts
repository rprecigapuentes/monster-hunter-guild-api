import type { Monster as PrismaMonster } from "../generated/prisma/client";
import { Monster } from "../entities/Monster";

/**
 * Prisma → Domain Entity
 */
export function toMonsterEntity(data: PrismaMonster): Monster {
  return new Monster({
    id: data.id,
    name: data.name,
    species: data.species,
    dangerLevel: data.dangerLevel,
    rewardValue: data.rewardValue,
  });
}