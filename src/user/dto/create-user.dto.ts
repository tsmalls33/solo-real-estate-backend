import { UserRoles, CreateUserDto as SharedCreateUserDto } from "@RealEstate/types";
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
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto implements SharedCreateUserDto {
  @ApiProperty({ required: true, example: 'john@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ required: true, example: 'Str0ngP@ssw0rd!' })
  @IsString()
  @IsNotEmpty()
  @Matches(PASSWORD_PATTERN, { message: VALIDATION_MESSAGES.PASSWORD })
  password: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Matches(FULL_NAME_PATTERN, { message: VALIDATION_MESSAGES.FULL_NAME })
  fullName?: string;

  @IsOptional()
  @IsEnum(UserRoles)
  role?: UserRoles;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  id_tenant?: string; // Optional, if user is created within a tenant context
}
