import type { Request, Response, NextFunction } from 'express';
import { z, type ZodType } from 'zod';
import { logger } from '../lib/logger';

export function validate(schema: ZodType) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const message = buildErrorMessage(result.error);
      logger.warn(message, { method: req.method, path: req.originalUrl });
      res.status(400).json({
        message: buildErrorMessage(result.error),
        errors: z.treeifyError(result.error),
      });
      return;
    }

    req.body = result.data;
    next();
  };
}

function buildErrorMessage(error: z.ZodError): string {
  const unrecognizedKeysIssue = error.issues.find((issue) => issue.code === 'unrecognized_keys');

  if (unrecognizedKeysIssue && 'keys' in unrecognizedKeysIssue) {
    const fields = unrecognizedKeysIssue.keys.join(', ');
    return `The following fields cannot be set directly: ${fields}`;
  }

  return 'Validation error';
}
