import type { QuestAssignment } from '../generated/prisma/client';
import type { HunterService } from './hunter.service';
import type { QuestAssignmentService } from './quest-assignment.service';

export class RewardDistributionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RewardDistributionError';
  }
}

interface RewardDistributionServiceDependencies {
  hunterService: HunterService;
  getQuestAssignmentService: () => QuestAssignmentService;
}

export class RewardDistributionService {
  private static readonly LEADER_PERCENTAGE = 0.4;
  private readonly hunterService: HunterService;
  private readonly getQuestAssignmentService: () => QuestAssignmentService;

  constructor(deps: RewardDistributionServiceDependencies) {
    this.hunterService = deps.hunterService;
    this.getQuestAssignmentService = deps.getQuestAssignmentService;
  }

  async distributeRewards(questId: string, reward: number): Promise<void> {
    if (reward === 0) {
      return;
    }

    const questAssignmentService = this.getQuestAssignmentService();
    const assignments = await questAssignmentService.findByQuest(questId);
    const leader = assignments.find((assignment) => assignment.role === 'Leader')!;

    const members = assignments.filter((assignment) => assignment.role !== 'Leader');

    await this.rewardLeader(leader, reward);
    await this.rewardMembers(members, reward);
  }

  private async rewardLeader(leader: QuestAssignment, reward: number): Promise<void> {
    const leaderReward = this.calculateLeaderReward(reward);
    await this.hunterService.addExperience(leader.hunterId, leaderReward);
  }

  private async rewardMembers(members: QuestAssignment[], reward: number): Promise<void> {
    if (members.length === 0) {
      return;
    }

    const rewardPerHunter = this.calculateMemberReward(reward, members.length);
    for (const hunter of members) {
      await this.hunterService.addExperience(hunter.hunterId, rewardPerHunter);
    }
  }

  private calculateLeaderReward(reward: number): number {
    return Math.floor(reward * RewardDistributionService.LEADER_PERCENTAGE);
  }

  private calculateMemberReward(reward: number, memberCount: number): number {
    const remainingReward = reward - this.calculateLeaderReward(reward);

    return Math.floor(remainingReward / memberCount);
  }
}
