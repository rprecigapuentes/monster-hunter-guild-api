import type { QuestAssignment } from '../../generated/prisma/client';
import type { RewardAllocation } from './interfaces/reward-allocation.interface';
import type { IRewardDistributionStrategy } from './interfaces/reward-distribution-strategy.interface';

export class DefaultRewardDistributionStrategy implements IRewardDistributionStrategy {
  private static readonly LEADER_PERCENTAGE = 0.4;

  distribute(reward: number, assignments: QuestAssignment[]): RewardAllocation[] {
    const leader = this.findLeader(assignments);

    if (!leader) {
      return [];
    }

    const members = this.findMembers(assignments);

    return this.buildAllocations(reward, leader, members);
  }

  private findLeader(assignments: QuestAssignment[]): QuestAssignment | undefined {
    return assignments.find((assignment) => assignment.role === 'Leader');
  }

  private findMembers(assignments: QuestAssignment[]): QuestAssignment[] {
    return assignments.filter((assignment) => assignment.role !== 'Leader');
  }

  private buildAllocations(
    reward: number,
    leader: QuestAssignment,
    members: QuestAssignment[]
  ): RewardAllocation[] {
    const allocations: RewardAllocation[] = [];

    const leaderReward = this.calculateLeaderReward(reward);

    allocations.push({
      hunterId: leader.hunterId,
      experience: leaderReward,
    });

    if (members.length === 0) {
      return allocations;
    }

    const memberReward = this.calculateMemberReward(reward, leaderReward, members.length);

    for (const member of members) {
      allocations.push({
        hunterId: member.hunterId,
        experience: memberReward,
      });
    }

    return allocations;
  }

  private calculateLeaderReward(reward: number): number {
    return Math.floor(reward * DefaultRewardDistributionStrategy.LEADER_PERCENTAGE);
  }

  private calculateMemberReward(
    reward: number,
    leaderReward: number,
    membersCount: number
  ): number {
    return Math.floor((reward - leaderReward) / membersCount);
  }
}
