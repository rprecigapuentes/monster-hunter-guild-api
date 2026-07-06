import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { validate } from './validate.middleware';

describe('validate', () => {
  const schema = z.object({ name: z.string().min(1) });

  let res: Response;
  let next: NextFunction;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    res = { status: statusMock } as unknown as Response;
    next = jest.fn();
  });

  it('calls next and replaces req.body with the parsed data when valid', () => {
    const req = { body: { name: 'Ravagers' } } as Request;

    validate(schema)(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(req.body).toEqual({ name: 'Ravagers' });
    expect(statusMock).not.toHaveBeenCalled();
  });

  it('responds with 400 and validation errors when invalid, without calling next', () => {
    const req = { body: { name: '' } } as Request;

    validate(schema)(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Validation error' })
    );
  });
});