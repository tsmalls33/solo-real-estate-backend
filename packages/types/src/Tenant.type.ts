import { UserResponseDto } from './User.type'

export class TenantResonseDto {
  id_tenant!: string
  name!: string
  customDomain?: string | null
  id_plan?: string | null
  users?: UserResponseDto[] | null
}

export class CreateTenantDto {
  name!: string
  customDomain?: string | null
  id_plan?: string | null
}

export class GetTenantQueryParams {
  includeUsers?: boolean
}
