import { type Quest } from '../../../../../src/generated/prisma/client';
import { FailedQuestState } from '../../../../../src/services/quest/states/failed-quest-state';

describe('FailedQuestState', () => {
  let state: FailedQuestState;
  const mockQuest = {
    id: 'uuid-uuid-uuid-uuid',
    title: 'Failed Quest',
    reward: 100,
  } as Quest;

  beforeEach(() => {
    state = new FailedQuestState();
  });

  it('should have FAILED status', () => {
    expect(state.status).toBe('FAILED');
  });

  it('should return valid transitions only to PENDING', () => {
    expect(state.getValidTransitions()).toEqual(['PENDING']);
  });

  it('should resolve validateBefore without throwing errors', async () => {
    await expect(state.validateBefore(mockQuest)).resolves.not.toThrow();
  });

  it('should resolve onEnter without throwing errors', async () => {
    await expect(state.onEnter(mockQuest)).resolves.not.toThrow();
  });
});
