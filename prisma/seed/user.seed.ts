
// prisma/seed/users.seed.ts
import type { PrismaClient, Tenant, User } from '@prisma/client';
import { UserRoles } from '@prisma/client';

type SeedTenantsResult = Record<string, Tenant>

export async function seedUsers(
  prisma: PrismaClient,
  tenants: SeedTenantsResult,
): Promise<Record<string, User>> {
  // Upsert by email because it's @unique. [web:34]
  const superadmin = await prisma.user.upsert({
    where: { email: 'superadmin@gmail.com' },
    update: { fullName: 'Super Admin', role: UserRoles.SUPERADMIN, id_tenant: null },
    create: {
      email: 'superadmin@gmail.com',
      passwordHash: 'pass',
      fullName: 'Super Admin',
      role: UserRoles.SUPERADMIN,
      id_tenant: null,
    },
  });

  const defaultAdmin = await prisma.user.upsert({
    where: { email: 'admin@default.com' },
    update: {
      fullName: 'Default Admin',
      role: UserRoles.ADMIN,
      id_tenant: tenants.default.id_tenant,
    },
    create: {
      email: 'admin@default.com',
      passwordHash: 'pass',
      fullName: 'Default Admin',
      role: UserRoles.ADMIN,
      id_tenant: tenants.default?.id_tenant,
    },
  });

  const devomartAdmin = await prisma.user.upsert({
    where: { email: 'admin@devomart.es' },
    update: {
      fullName: 'Devomart Admin',
      role: UserRoles.ADMIN,
      id_tenant: tenants.devomart?.id_tenant,
    },
    create: {
      email: 'admin@devomart.es',
      passwordHash: 'pass',
      fullName: 'Devomart Admin',
      role: UserRoles.ADMIN,
      id_tenant: tenants.devomart?.id_tenant,
    },
  });

  const devomartEmployee = await prisma.user.upsert({
    where: { email: 'employee@devomart.es' },
    update: {
      fullName: 'Devomart Employee',
      role: UserRoles.EMPLOYEE,
      id_tenant: tenants.devomart?.id_tenant,
    },
    create: {
      email: 'employee@devomart.es',
      passwordHash: 'pass',
      fullName: 'Devomart Employee',
      role: UserRoles.EMPLOYEE,
      id_tenant: tenants.devomart?.id_tenant,
    },
  });

  return { superadmin, defaultAdmin, devomartAdmin, devomartEmployee };
}


