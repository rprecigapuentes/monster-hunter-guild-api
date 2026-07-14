import type { QuestAssignment } from '../../generated/prisma/client';
import type { RewardAllocation } from './interfaces/reward-allocation.interface';
import type { IRewardDistributionStrategy } from './interfaces/reward-distribution-strategy.interface';

export class DefaultRewardDistributionStrategy
  implements IRewardDistributionStrategy
{
  private static readonly LEADER_PERCENTAGE = 0.4;

  distribute(
    reward: number,
    assignments: QuestAssignment[]
  ): RewardAllocation[] {
    const leader = assignments.find(
      (assignment) => assignment.role === 'Leader'
    );

    if (!leader) {
      return [];
    }

    const members = assignments.filter(
      (assignment) => assignment.role !== 'Leader'
    );

    const allocations: RewardAllocation[] = [];

    const leaderReward = Math.floor(
      reward * DefaultRewardDistributionStrategy.LEADER_PERCENTAGE
    );

    allocations.push({
      hunterId: leader.hunterId,
      experience: leaderReward,
    });

    if (members.length === 0) {
      return allocations;
    }

    const remainingReward = reward - leaderReward;

    const rewardPerHunter = Math.floor(
      remainingReward / members.length
    );

    for (const member of members) {
      allocations.push({
        hunterId: member.hunterId,
        experience: rewardPerHunter,
      });
    }

    return allocations;
  }
}