import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { SignInDto } from './signin.dto';
import { UserRoles } from "@RealEstate/types";

export class SignUpDto extends SignInDto {
  @IsString()
  @IsOptional()
  fullName: string;

  @IsString()
  @IsOptional()
  @IsEnum(UserRoles)
  role: UserRoles;

  @IsString()
  @IsOptional()
  @IsUUID()
  id_tenant: string;
}
