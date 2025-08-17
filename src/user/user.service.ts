import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';


// TODO: Add password hashing and validation logic

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const isUserExists = await this.prisma.user.findUnique({
      where: {
        email: createUserDto.email,
      },
    });

    if (isUserExists) throw new ConflictException('User already exists'); // returns 409 Conflict

    const dbUser = {
      email: createUserDto.email,
      password_hash: createUserDto.password, // This should be hashed before saving
      full_name: createUserDto.full_name,
      role: createUserDto.role,
      tenant_id: createUserDto.tenant_id, // Optional, if user is created within a tenant context
    }

    return this.prisma.user.create({
      data: dbUser,
      select: {
        id: true,
        email: true,
        full_name: true,
        role: true,
        tenant_id: true, // Optional, if user is created within a tenant context
      },
    });
  }
  
  findAll() {
    // Returns array of User objects --> User[]
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true, 
        full_name: true,
        role: true,
      }
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
      },
    });

    if (!foundUser) throw new NotFoundException('User not found'); // returns 404 Not Found

    return foundUser;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {

    // Check if at least one field is provided for update
    if (!updateUserDto.email && !updateUserDto.full_name && !updateUserDto.role && !updateUserDto.tenant_id) {
      throw new ConflictException('No fields to update'); // returns 409 Conflict
    }

    // Check if user exists
    const foundUser = await this.prisma.user.findUnique({
      where: { id },
      });
    
    if (!foundUser) throw new NotFoundException('User not found'); // returns 404 Not Found

    // Update user with provided fields
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
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
      data: updatedUser
    }
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
    }
  }
}
