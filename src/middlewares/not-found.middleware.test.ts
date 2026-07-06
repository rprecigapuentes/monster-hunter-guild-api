import type { Request, Response } from 'express';
import { notFound } from './not-found.middleware';

describe('notFound', () => {
  it('responds with 404 and a route-not-found message', () => {
    const jsonMock = jest.fn();
    const statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    const req = {} as Request;
    const res = { status: statusMock } as unknown as Response;

    notFound(req, res);

    expect(statusMock).toHaveBeenCalledWith(404);
    expect(jsonMock).toHaveBeenCalledWith({ message: 'Route not found' });
  });
});