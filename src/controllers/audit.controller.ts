import type { Request, Response, NextFunction } from 'express';
import type { AuditLog } from '../generated/prisma/client';
import type { IReadableService } from '../services/interfaces/readable-service.interface';

export class AuditController {
  constructor(private readonly service: IReadableService<AuditLog>) {}

  findAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const auditLogs = await this.service.findAll();
      res.status(200).json(auditLogs);
    } catch (error) {
      next(error);
    }
  };

  findById = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const auditLog = await this.service.findById(req.params.id);
      res.status(200).json(auditLog);
    } catch (error) {
      next(error);
    }
  };
}
