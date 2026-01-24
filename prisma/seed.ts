
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

import { seedTenants } from './seed/tenant.seed';
import { seedUsers } from './seed/user.seed';

const prisma = new PrismaClient();

async function main() {
  console.log('Running seeds......')
  const tenants = await seedTenants(prisma);
  await seedUsers(prisma, tenants);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


