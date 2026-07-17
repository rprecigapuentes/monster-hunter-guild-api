import { NotFoundError } from '../errors';
import type { AuditLog, Prisma } from '../generated/prisma/client';
import type { IBasicRepository } from '../repositories/interfaces/basic-repository.interface';
import type { IReadableService } from './interfaces/readable-service.interface';

export class AuditNotFoundError extends NotFoundError {
  constructor(id: string) {
    super(`Audit log with ID ${id} was not found.`);
  }
}

export class AuditService implements IReadableService<AuditLog> {
  constructor(
    private readonly repository: IBasicRepository<
      AuditLog,
      Prisma.AuditLogUncheckedCreateInput,
      Prisma.AuditLogUncheckedUpdateInput
    >
  ) {}

  async findAll(): Promise<AuditLog[]> {
    return await this.repository.findAll();
  }

  async findById(id: string): Promise<AuditLog> {
    const auditLog = await this.repository.findById(id);
    if (!auditLog) {
      throw new AuditNotFoundError(id);
    }
    return auditLog;
  }
}
