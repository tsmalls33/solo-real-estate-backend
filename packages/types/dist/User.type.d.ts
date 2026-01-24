export declare const UserRoles: {
    readonly CLIENT: "CLIENT";
    readonly ADMIN: "ADMIN";
    readonly SUPERADMIN: "SUPERADMIN";
    readonly EMPLOYEE: "EMPLOYEE";
};
export type UserRoles = (typeof UserRoles)[keyof typeof UserRoles];
export declare class UserResponseDto {
    id_user: string;
    email: string;
    fullName?: string | null;
    role: UserRoles;
    id_tenant?: string | null;
}
export declare class PrivateUserResponseDto extends UserResponseDto {
    passwordHash?: string;
}
export declare class CreateUserDto {
    email: string;
    password: string;
    fullName?: string | null;
    role?: UserRoles | null;
    id_tenant?: string | null;
}
