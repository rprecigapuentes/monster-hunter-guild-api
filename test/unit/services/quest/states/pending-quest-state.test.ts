import { type Quest } from '../../../../../src/generated/prisma/client';
import { PendingQuestState } from '../../../../../src/services/quest/states/pending-quest-state';

describe('PendingQuestState', () => {
  let state: PendingQuestState;
  const mockQuest = {
    id: 'uuid-uuid-uuid-uuid',
    title: 'Pending Quest',
    reward: 100,
  } as Quest;

  beforeEach(() => {
    state = new PendingQuestState();
  });

  it('should have PENDING status', () => {
    expect(state.status).toBe('PENDING');
  });

  it('should return valid transitions only to IN_PROGRESS', () => {
    expect(state.getValidTransitions()).toEqual(['IN_PROGRESS']);
  });

  it('should resolve validateBefore without throwing errors', async () => {
    await expect(state.validateBefore(mockQuest)).resolves.not.toThrow();
  });

  it('should resolve onEnter without throwing errors', async () => {
    await expect(state.onEnter(mockQuest)).resolves.not.toThrow();
  });
});
