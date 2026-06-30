import { prisma } from './prisma';

describe('Instanciated Prisma (with mysql adapter) client', () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });
  it('with the database created and env variables configured, executing a "SELECT 1" raw query, should return [{ "1": 1n }]', async () => {
    const response = await prisma.$queryRaw`SELECT 1`;

    expect(response).toEqual([{ '1': 1n }]);
  });
});
