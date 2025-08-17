import { Role } from '../user-roles';
import { IsEmail, IsNotEmpty, MinLength, IsAlpha, IsUUID, IsOptional, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @MinLength(6)
  password: string;

  @IsOptional()
  @Matches(/^[A-Za-z\s]+$/, {
      message: 'Full name must contain only letters and spaces',
    })
  full_name: string;

  @Transform(({value}) => value || 'CLIENT') // Default role if not provided
  role: Role;

  @IsOptional()
  @IsUUID()
  tenant_id: string; // Optional, if user is created within a tenant context
}
