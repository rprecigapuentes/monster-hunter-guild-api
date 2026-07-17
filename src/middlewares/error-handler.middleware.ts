import type { Request, Response, NextFunction } from 'express';
import { Prisma } from '../generated/prisma/client';
import { ApplicationError } from '../errors';
import { logger } from '../lib/logger';

export function errorHandler(
  error: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (error instanceof ApplicationError) {
    logger.warn(error.message, { errorType: error.name, path: req.path, method: req.method });
    res.status(error.statusCode).json({ message: error.message });
    return;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    logger.warn('Database request error', { code: error.code, path: req.path });
    res.status(400).json({ message: 'Database request error', code: error.code });
    return;
  }

  logger.error('Unhandled error', { error, path: req.path, method: req.method });
  res.status(500).json({ message: 'Internal server error' });
}