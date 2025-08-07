import { Role } from '../user-roles';

export class CreateUserDto {
  email: string;
  password_hash: string;
  full_name: string;
  role: Role;
}
