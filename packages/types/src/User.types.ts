
export const UserRoles = {
  CLIENT: 'CLIENT',
  ADMIN: 'ADMIN',
  SUPERADMIN: 'SUPERADMIN',
  EMPLOYEE: 'EMPLOYEE'
} as const;

export type UserRoles = (typeof UserRoles)[keyof typeof UserRoles]

export class UserResponseDto {
  id_user!: string;
  email!: string;
  fullName?: string;
  role!: UserRoles;
  id_tenant?: string;
}

export class CreateUserDto {
  email!: string;
  password!: string;
  fullName?: string;
  role?: UserRoles;
  id_tenant?: string; // Optional, if user is created within a tenant context
}

