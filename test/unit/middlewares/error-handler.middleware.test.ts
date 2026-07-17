import type { Request, Response, NextFunction } from 'express';
import { Prisma } from '../../../src/generated/prisma/client';
import { errorHandler } from '../../../src/middlewares/error-handler.middleware';
import { NotFoundError, ValidationError } from '../../../src/errors';
import { logger } from '../../../src/lib/logger';

jest.mock('../../../src/lib/logger', () => ({
  logger: {
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

class TestNotFoundError extends NotFoundError {}
class TestValidationError extends ValidationError {}

describe('errorHandler', () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    req = { path: '/test', method: 'GET' } as Request;
    res = { status: statusMock } as unknown as Response;
    next = jest.fn();
  });

  it('responds with 404 when the error is a NotFoundError subclass', () => {
    const error = new TestNotFoundError('Hunter with id 1 was not found');

    errorHandler(error, req, res, next);

    expect(statusMock).toHaveBeenCalledWith(404);
    expect(jsonMock).toHaveBeenCalledWith({ message: 'Hunter with id 1 was not found' });
  });

  it('responds with 400 when the error is a ValidationError subclass', () => {
    const error = new TestValidationError('Name is required');

    errorHandler(error, req, res, next);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({ message: 'Name is required' });
  });

  it('responds with 400 when the error is a Prisma known request error', () => {
    const error = new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
      code: 'P2002',
      clientVersion: '7.8.0',
    });

    errorHandler(error, req, res, next);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      message: 'Database request error',
      code: 'P2002',
    });
  });

  it('responds with 500 and logs the error for anything unrecognized', () => {
    const error = new Error('Something unexpected');

    errorHandler(error, req, res, next);

    expect(logger.error).toHaveBeenCalledWith(
      'Unhandled error',
      expect.objectContaining({ error })
    );
    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({ message: 'Internal server error' });
  });
});