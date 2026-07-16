import { AuditService, AuditNotFoundError } from '../../../src/services/audit.service';
import type { AuditRepository } from '../../../src/repositories/audit.repository';
import type { AuditLog } from '../../../src/generated/prisma/client';

describe('AuditService', () => {
  let repository: jest.Mocked<AuditRepository>;
  let service: AuditService;

  const auditLog: AuditLog = {
    id: '1',
    operation: 'CREATED',
    entity: 'Hunter',
    entityId: '42',
    timestamp: new Date(),
  };

  beforeEach(() => {
    repository = {
      findAll: jest.fn(),
      findById: jest.fn(),
    } as unknown as jest.Mocked<AuditRepository>;
    service = new AuditService(repository);
  });

  it('returns all audit logs', async () => {
    repository.findAll.mockResolvedValue([auditLog]);
    expect(await service.findAll()).toEqual([auditLog]);
  });

  it('returns an audit log by id', async () => {
    repository.findById.mockResolvedValue(auditLog);
    expect(await service.findById('1')).toEqual(auditLog);
  });

  it('throws AuditNotFoundError when the audit log is missing', async () => {
    repository.findById.mockResolvedValue(null);
    await expect(service.findById('65')).rejects.toThrow(AuditNotFoundError);
  });
});