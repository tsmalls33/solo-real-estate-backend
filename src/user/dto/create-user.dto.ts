import { Role } from '../user-roles';

export class CreateUserDto {
  email: string;
  password: string;
  full_name: string;
  role: Role;
  tenant_id?: string; // Optional, if user is created within a tenant context
}
