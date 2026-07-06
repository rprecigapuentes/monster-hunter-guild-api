import type { Request, Response, NextFunction } from 'express';
import { Prisma } from '../generated/prisma/client';
import { errorHandler } from './error-handler.middleware';

describe('errorHandler', () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    req = {} as Request;
    res = { status: statusMock } as unknown as Response;
    next = jest.fn();
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('responds with 404 when the error name ends with NotFoundError', () => {
    const error = new Error('Hunter with id 1 was not found');
    error.name = 'HunterNotFoundError';

    errorHandler(error, req, res, next);

    expect(statusMock).toHaveBeenCalledWith(404);
    expect(jsonMock).toHaveBeenCalledWith({ message: 'Hunter with id 1 was not found' });
  });

  it('responds with 400 when the error name ends with ValidationError', () => {
    const error = new Error('Name is required');
    error.name = 'HunterValidationError';

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

    expect(consoleSpy).toHaveBeenCalledWith(error);
    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({ message: 'Internal server error' });
  });
});