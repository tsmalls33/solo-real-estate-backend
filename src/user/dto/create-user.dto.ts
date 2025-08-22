import { Role } from '../user-roles';
import { IsString, IsEmail, IsNotEmpty, MinLength, IsAlpha, IsUUID, IsOptional, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message:
      'Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number and one special character',
  })
  password: string;

  @IsOptional()
  @Matches(/^[A-Za-z\s]+$/, {
      message: 'Full name must contain only letters and spaces',
    })
  full_name?: string;

  role?: Role; // Default role is handled in the DB

  @IsOptional()
  @IsUUID()
  tenant_id?: string; // Optional, if user is created within a tenant context
}
