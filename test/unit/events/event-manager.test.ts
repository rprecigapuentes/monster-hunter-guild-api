import { EventManager, type IObserver, type DomainEvent } from '../../../src/events/event-manager';

describe('EventManager', () => {
  let manager: EventManager;
  let observer: jest.Mocked<IObserver>;
  const event: DomainEvent = { operation: 'CREATED', entity: 'Hunter' };

  beforeEach(() => {
    manager = new EventManager();
    observer = { update: jest.fn() };
  });

  it('notifies a subscriber registered for a specific event type', async () => {
    manager.subscribe('entity.created', observer);
    await manager.notify('entity.created', event);
    expect(observer.update).toHaveBeenCalledWith(event);
  });

  it('does not notify a subscriber of a different event type', async () => {
    manager.subscribe('entity.deleted', observer);
    await manager.notify('entity.created', event);
    expect(observer.update).not.toHaveBeenCalled();
  });

  it('notifies subscribers of every event type', async () => {
    manager.subscribe('*', observer);
    await manager.notify('quest.completed', event);
    expect(observer.update).toHaveBeenCalledWith(event);
  });

  it('stops notifying after unsubscribe', async () => {
    manager.subscribe('entity.created', observer);
    manager.unsubscribe('entity.created', observer);
    await manager.notify('entity.created', event);
    expect(observer.update).not.toHaveBeenCalled();
  });

  it('runs every observer even if one fail', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const failingObserver: jest.Mocked<IObserver> = { update: jest.fn().mockRejectedValue(new Error('Update failed')) };
    const ok: jest.Mocked<IObserver> = { update: jest.fn() };
    manager.subscribe('entity.created', failingObserver);
    manager.subscribe('entity.created', ok);
    await expect(manager.notify('entity.created', event)).resolves.toBeUndefined();
    expect(ok.update).toHaveBeenCalledWith(event);
    expect(errorSpy).toHaveBeenCalledWith('Observer update failed:', expect.any(Error));
    errorSpy.mockRestore();
  });
});