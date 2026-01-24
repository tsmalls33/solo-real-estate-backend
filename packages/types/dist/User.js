"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserDto = exports.PrivateUserResponseDto = exports.UserResponseDto = exports.UserRoles = void 0;
exports.UserRoles = {
    CLIENT: 'CLIENT',
    ADMIN: 'ADMIN',
    SUPERADMIN: 'SUPERADMIN',
    EMPLOYEE: 'EMPLOYEE'
};
class UserResponseDto {
}
exports.UserResponseDto = UserResponseDto;
class PrivateUserResponseDto extends UserResponseDto {
}
exports.PrivateUserResponseDto = PrivateUserResponseDto;
class CreateUserDto {
}
exports.CreateUserDto = CreateUserDto;
