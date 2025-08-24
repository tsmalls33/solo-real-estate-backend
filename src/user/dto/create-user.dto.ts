import { Role } from '../user-roles';
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsUUID,
  IsOptional,
  Matches,
  IsEnum,
} from 'class-validator';
import {
  PASSWORD_PATTERN,
  FULL_NAME_PATTERN,
  VALIDATION_MESSAGES,
} from 'src/utils/validators/validation-patterns';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Matches(PASSWORD_PATTERN, { message: VALIDATION_MESSAGES.PASSWORD })
  password: string;

  @IsOptional()
  @Matches(FULL_NAME_PATTERN, { message: VALIDATION_MESSAGES.FULL_NAME })
  full_name: string;

  @IsOptional()
  @IsEnum(Role)
  role: Role;

  @IsOptional()
  @IsUUID()
  tenant_id: string; // Optional, if user is created within a tenant context
}
