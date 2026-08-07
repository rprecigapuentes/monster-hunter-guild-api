import request, { type Response } from 'supertest';
import app from '../../../src/app/app';

describe('GET /', () => {
  let response: Response;
  beforeEach(async () => {
    response = await request(app).get('/').set('Accept', 'application/json');
  });
  it('should return a "Hello Steeven!!"', () => {
    expect(response.body).toEqual({ message: 'Hello Steeven!!' });
  });

  it('should return a 200 status code', () => {
    expect(response.statusCode).toBe(200);
  });

  it('should define json format in headers', () => {
    expect(response.headers['content-type']).toMatch(/json/);
  });
});
