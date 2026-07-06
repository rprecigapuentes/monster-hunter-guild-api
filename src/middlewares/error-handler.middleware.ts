import type { Request, Response, NextFunction } from 'express';
import { Prisma } from '../generated/prisma/client';

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (error instanceof Error && error.name.endsWith('NotFoundError')) {
    res.status(404).json({ message: error.message });
    return;
  }
  if (error instanceof Error && error.name.endsWith('ValidationError')) {
    res.status(400).json({ message: error.message });
    return;
  }
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    res.status(400).json({ message: 'Database request error', code: error.code });
    return;
  }
  console.error(error);
  res.status(500).json({ message: 'Internal server error' });
}