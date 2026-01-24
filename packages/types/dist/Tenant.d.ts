import { UserResponseDto } from './User';
export declare class TenantResonseDto {
    id_tenant: string;
    name: string;
    customDomain?: string | null;
    id_plan?: string | null;
    users?: UserResponseDto[] | null;
}
export declare class CreateTenantDto {
    name: string;
    customDomain?: string | null;
    id_plan?: string | null;
}
export declare class GetTenantQueryParams {
    includeUsers?: boolean;
}
