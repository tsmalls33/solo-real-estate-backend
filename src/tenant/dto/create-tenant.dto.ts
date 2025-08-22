import { IsOptional, IsUrl, IsUUID, IsString } from 'class-validator';

export class CreateTenantDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsUrl()
  custom_domain: string;

  @IsOptional()
  @IsUUID()
  plan_id: string;
}
