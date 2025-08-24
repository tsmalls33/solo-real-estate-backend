import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';
import {
  PASSWORD_PATTERN,
  VALIDATION_MESSAGES,
} from 'src/utils/validators/validation-patterns';

export class SignInDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Matches(PASSWORD_PATTERN, { message: VALIDATION_MESSAGES.PASSWORD })
  password: string;
}
