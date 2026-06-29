interface Guild {
  name: string;
  region: string;
  headquarters: string;
}

export function greetGuild(guild: Guild): string {
  return `Welcome to the ${guild.name}, based in ${guild.headquarters} (${guild.region})!`;
}

const exampleGuild: Guild = {
  name: 'Monster Hunter Guild',
  region: 'Central Continent',
  headquarters: 'Astera',
};

console.log('Hello World!');
console.log(greetGuild(exampleGuild));

// Check ORM - Database conection
import { prisma } from './lib/prisma';

export async function testDbConection() {
  console.log('Testing db conection...');

  await prisma.$queryRaw`SELECT 1`;

  console.log(
    `Succesfully connecte to database "${process.env.DATABASE_NAME}" at ${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}`
  );
}
