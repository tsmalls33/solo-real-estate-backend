import { Tenant } from '@prisma/client';
export declare class TenantEntity implements Tenant {
    id_tenant: string;
    name: string;
    customDomain: string | null;
    id_plan: string | null;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=Tenant.d.ts.map