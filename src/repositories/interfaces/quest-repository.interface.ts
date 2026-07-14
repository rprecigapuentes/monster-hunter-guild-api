import type { Prisma, Quest } from '../../generated/prisma/client';
import type { IBasicRepository } from './basic-repository.interface';

export interface IQuestRepository
  extends IBasicRepository<Quest, Prisma.QuestUncheckedCreateInput, Prisma.QuestUncheckedUpdateInput> {
  averageReward(): Promise<number>;
}