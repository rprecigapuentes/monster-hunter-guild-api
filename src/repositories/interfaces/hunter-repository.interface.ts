import type { Prisma, Hunter } from '../../generated/prisma/client';
import type { IBasicRepository } from './basic-repository.interface';

export interface IHunterRepository extends IBasicRepository<
  Hunter,
  Prisma.HunterUncheckedCreateInput,
  Prisma.HunterUncheckedUpdateInput
> {
  hunterLeaderboard(): Promise<Hunter[]>;
}
