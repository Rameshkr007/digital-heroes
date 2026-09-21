import { PrismaClient } from '@prisma/client';
import { runSeed } from '../src/utils/seed';

async function main() {
  const prismaClient = new PrismaClient();
  try {
    await runSeed(prismaClient);
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prismaClient.$disconnect();
  }
}

if (require.main === module) {
  main();
}
