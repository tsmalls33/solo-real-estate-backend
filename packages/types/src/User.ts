export interface User {
  id_user: string
  email: string
  passwordHash: string
  id_tenant?: string | null
  fullName?: string | null
  createdAt: Date
  updateAt: Date
  role: UserRoles
}

export enum UserRoles {
  ADMIN = 'ADMIN',
  EMPLOYEE = 'EMPLOYEE',
  CLIENT = 'CLIENT',
  SUPERADMIN = 'SUPERADMIN',
}

