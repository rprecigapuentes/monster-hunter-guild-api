import app from './app/app';
import { prisma } from './lib/prisma';

const port = process.env.APP_PORT || 3000;

export async function testDbConection() {
  console.log('Testing db conection...');

  await prisma.$queryRaw`SELECT 1`;

  console.log(
    `Succesfully connecte to database "${process.env.DATABASE_NAME}" at ${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}`
  );
}

app.listen(port, () => {
  console.log(`Express app running on port ${port}`);
});
