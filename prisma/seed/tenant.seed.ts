import type { PrismaClient, Tenant } from '@prisma/client';
import { SeedTenantsResult } from './seed-types';

export async function seedTenants(prisma: PrismaClient): Promise<SeedTenantsResult> {
  // Use upsert because Tenant.name is unique
  const defaultTenant = await prisma.tenant.upsert({
    where: { name: 'Default Tenant' },
    update: { customDomain: null },
    create: {
      name: 'Default Tenant',
      customDomain: null,
    },
  });

  const devomartTenant = await prisma.tenant.upsert({
    where: { name: 'Devomart' },
    update: { customDomain: 'www.devomart.es' },
    create: {
      name: 'Devomart',
      customDomain: 'www.devomart.es',
    },
  });

  return {
    default: defaultTenant,
    devomart: devomartTenant,
  };
}

