import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) { }

  async create(input: CreateUserDto) {
    /**
     * - Validate user input (handled by class-validator)
     * - Check if user already exists
     * - Hash password
     * - Create user
     */

    // Check if user already exists
    const isUserExists = await this.prisma.user.findUnique({
      where: {
        email: input.email,
      },
    });

    if (isUserExists) throw new ConflictException('User already exists');

    // Hash password
    const hashedPassword = await this.hashPassword(input.password);

    const { email, full_name, role, tenant_id } = input;

    // Create new user and return a safe response
    return await this.prisma.user.create({
      data: {
        email,
        full_name,
        role,
        tenant_id,
        password_hash: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        full_name: true,
        role: true,
        tenant_id: true,
      },
    });
  }

  findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        full_name: true,
        role: true,
      },
    });
  }

  async findOne(id: string) {
    const foundUser = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        full_name: true,
        role: true,
        tenant_id: true,
      },
    });

    if (!foundUser) throw new NotFoundException('User not found'); // returns 404 Not Found

    return foundUser;
  }

  async findByEmail(email: string) {
    const foundUser = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        full_name: true,
        role: true,
        tenant_id: true, // Optional, if user is created within a tenant context
        password_hash: true,
      },
    });
    if (!foundUser) throw new NotFoundException('User not found'); // returns 404 Not Found
    return foundUser;
  }

  async update(id: string, input: UpdateUserDto) {
    // Check if at least one field is provided for update
    if (
      !input.email &&
      !input.full_name &&
      !input.role &&
      !input.tenant_id
    ) {
      throw new ConflictException('No fields to update'); // returns 409 Conflict
    }

    // If email is being updated, check if it already exists
    if (input.email) {
      const isUserExists = await this.prisma.user.findUnique({
        where: {
          email: input.email,
        },
      });

      if (isUserExists) {
        throw new ConflictException(`User email '${input.email}' already exists`);
      }
    }

    // Check if user exists
    const foundUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!foundUser) throw new NotFoundException('User not found'); // returns 404 Not Found

    // Update user with provided fields
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: input,
      select: {
        id: true,
        email: true,
        full_name: true,
        role: true,
        tenant_id: true,
      },
    });

    // TODO: Use response interceptors wrapping the responses with codes and messages for all successful reaponses
    return {
      code: 200,
      message: 'User updated successfully',
      data: updatedUser,
    };
  }

  async remove(id: string) {
    // Check if user exists
    const foundUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!foundUser) throw new NotFoundException('User not found'); // returns 404 Not Found

    // Delete user
    const deletedUser = await this.prisma.user.delete({
      where: { id },
      select: {
        id: true,
        email: true,
        full_name: true,
        role: true,
      },
    });

    // TODO: Use response interceptors for this
    return {
      code: 200,
      message: 'User deleted successfully',
      data: deletedUser,
    };
  }

  async hashPassword(password: string) {
    const saltOrRounds = Number(process.env.BCRYPT_SALT_ROUNDS);
    if (isNaN(saltOrRounds) || saltOrRounds < 4 || saltOrRounds > 15) {
      throw new Error(
        `Invalid BCRYPT_SALT_ROUNDS value: ${saltOrRounds}. It must be a positive integer between 4 and 15.`,
      );
    }
    // bcrypt lib has any types inside.
    return await bcrypt.hash(password, saltOrRounds);
  }

  async verifyPassword(plainTextPassword: string, hashedPassword: string) {
    return await bcrypt.compare(plainTextPassword, hashedPassword);
  }
}
