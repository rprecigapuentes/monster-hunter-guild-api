import { DefaultRewardDistributionStrategy } from '../../../src/strategies/reward/default-reward-distribution.strategy';

describe('DefaultRewardDistributionStrategy', () => {
  const strategy = new DefaultRewardDistributionStrategy();

  it('Should allocate 40% to leader and remaining equally to members', () => {
    const assignments = [
      {
        id: '1',
        hunterId: 'leader',
        questId: 'quest-1',
        role: 'Leader',
      },
      {
        id: '2',
        hunterId: 'member-1',
        questId: 'quest-1',
        role: 'Support',
      },
      {
        id: '3',
        hunterId: 'member-2',
        questId: 'quest-1',
        role: 'Scout',
      },
    ] as any;

    const result = strategy.distribute(1000, assignments);

    expect(result).toEqual([
      { hunterId: 'leader', experience: 400 },
      { hunterId: 'member-1', experience: 300 },
      { hunterId: 'member-2', experience: 300 },
    ]);
  });

  it('Should allocate only leader reward when there are no members', () => {
    const assignments = [
      {
        id: '1',
        hunterId: 'leader',
        questId: 'quest-1',
        role: 'Leader',
      },
    ] as any;

    const result = strategy.distribute(1000, assignments);

    expect(result).toEqual([
      { hunterId: 'leader', experience: 400 },
    ]);
  });

  it('Should return empty array when no leader exists', () => {
    const assignments = [
      {
        id: '1',
        hunterId: 'member-1',
        questId: 'quest-1',
        role: 'Support',
      },
    ] as any;

    const result = strategy.distribute(1000, assignments);

    expect(result).toEqual([]);
  });
});