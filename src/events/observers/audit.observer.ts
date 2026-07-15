import type { IObserver, DomainEvent } from '../event-manager';
import type { AuditLog, Prisma } from '../../generated/prisma/client';
import type { IBasicRepository } from '../../repositories/interfaces/basic-repository.interface';

export class AuditObserver implements IObserver {
  constructor(
    private readonly auditRepository: IBasicRepository<
      AuditLog,
      Prisma.AuditLogUncheckedCreateInput,
      Prisma.AuditLogUncheckedUpdateInput
    >
  ) {}

  async update(event: DomainEvent): Promise<void> {
    await this.auditRepository.create({
      operation: event.operation,
      entity: event.entity,
      entityId: event.entityId,
    });
  }
}
