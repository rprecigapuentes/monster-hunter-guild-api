import request from 'supertest';
import express, { type Express } from 'express';
import { AuditController } from '../../../src/controllers/audit.controller';
import {AuditNotFoundError } from '../../../src/services/audit.service';
import type { IReadableService } from '../../../src/services/interfaces/readable-service.interface';
import type { AuditLog } from '../../../src/generated/prisma/client';
import { errorHandler } from '../../../src/middlewares/error-handler.middleware';
import { notFound } from '../../../src/middlewares/not-found.middleware';

describe('AuditController', () => {
  let app: Express;
  let mockAuditService: jest.Mocked<IReadableService<AuditLog>>;

  const mockAuditLog: AuditLog= {
    id: '1',
    operation: 'CREATED',
    entity: 'Hunter',
    entityId: '42',
    timestamp: new Date(),
  };

  beforeEach(() => {
    mockAuditService = {
      findAll: jest.fn(),
      findById: jest.fn(),
    } as unknown as jest.Mocked<IReadableService<AuditLog>>;

    const auditController = new AuditController(mockAuditService);

    app = express();
    app.use(express.json());
    app.get('/audits', auditController.findAll);
    app.get('/audits/:id', auditController.findById);
    app.use(notFound);
    app.use(errorHandler);
    });

    it('GET /audits returns all audit logs with 200', async () => {
        mockAuditService.findAll.mockResolvedValue([mockAuditLog]);

        const response = await request(app).get('/audits');

        expect(response.status).toBe(200);
        expect(mockAuditService.findAll).toHaveBeenCalledTimes(1);
    });

    it('GET /audits/:id returns audit log by id with 200', async () => {
        mockAuditService.findById.mockResolvedValue(mockAuditLog);

        const response = await request(app).get('/audits/1');

        expect(response.status).toBe(200);
        expect(mockAuditService.findById).toHaveBeenCalledWith('1');
    });

    it('GET /audits/:id returns 404 if audit log not found', async () => {
        mockAuditService.findById.mockRejectedValue(new AuditNotFoundError('1'));

        const response = await request(app).get('/audits/1');

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: 'Audit log with ID 1 was not found.' });
    });
});
