import { Prisma } from "../generated/prisma/client";

export type CreateHunterDto = Omit<Prisma.HunterUncheckedCreateInput, 'rank' | 'experiencePoints'>;

export type UpdateHunterDto = Omit<Prisma.HunterUncheckedUpdateInput, 'rank' | 'experiencePoints'>;