import type { Request, Response } from 'express';
import { logger } from '../lib/logger';

export function notFound(req: Request, res: Response): void {
  logger.warn('Route not found', { method: req.method, path: req.originalUrl });
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}
