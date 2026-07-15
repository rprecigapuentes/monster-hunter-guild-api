import { AuditObserver } from '../../../../src/events/observers/audit.observer';
import type { DomainEvent } from '../../../../src/events/event-manager';
import { AuditRepository } from '../../../../src/repositories/audit.repository';

describe('AuditObserver', () => {
    let repository: jest.Mocked<AuditRepository>;
    let observer: AuditObserver;

    beforeEach(() => {
        repository = {
            create: jest.fn(),
        } as unknown as jest.Mocked<AuditRepository>;
        observer = new AuditObserver(repository);
    });

    it('creates an audit record from the event', async () => {
        const event: DomainEvent = {
            operation: 'CREATE',
            entity: 'Monster',
            entityId: '123',
        };

        await observer.update(event);

        expect(repository.create).toHaveBeenCalledWith({
            operation: 'CREATE',
            entity: 'Monster',
            entityId: '123',
        });
    }); 

    it('creates an audit record from the event when entityId is not provided', async () => {
        const event: DomainEvent = {
            operation: 'CREATE',
            entity: 'Monster',
        };

        await observer.update(event);

        expect(repository.create).toHaveBeenCalledWith({
            operation: 'CREATE',
            entity: 'Monster',
        });
    }); 

});
