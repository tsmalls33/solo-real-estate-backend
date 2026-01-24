
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
  fullName?: string | null;
  role!: UserRoles;
  id_tenant?: string | null;
}


export class PrivateUserResponseDto extends UserResponseDto {
  passwordHash?: string
}

export class CreateUserDto {
  email!: string;
  password!: string;
  fullName?: string | null;
  role?: UserRoles | null;
  id_tenant?: string | null; // Optional, if user is created within a tenant context
}

