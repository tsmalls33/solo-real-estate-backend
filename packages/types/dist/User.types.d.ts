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
    fullName?: string;
    role: UserRoles;
    id_tenant?: string;
}
export declare class CreateUserDto {
    email: string;
    password: string;
    fullName?: string;
    role?: UserRoles;
    id_tenant?: string;
}
