import { Tenant, User } from '@prisma/client'

export type SeedTenantsResult = Record<string, Tenant> & {
  default: Tenant;
  devomart: Tenant;
};

export type SeeUsersResult = Record<string, User>
