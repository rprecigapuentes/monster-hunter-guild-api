import type { QuestAssignment } from '../../../generated/prisma/client';
import type { RewardAllocation } from './reward-allocation.interface';

export interface IRewardDistributionStrategy {
  distribute(reward: number, assignments: QuestAssignment[]): RewardAllocation[];
}
