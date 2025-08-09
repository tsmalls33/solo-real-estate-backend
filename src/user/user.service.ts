import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

// TODO: Need data validation for inproper input. Right now we only get a 500 error if the input is not valid.

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const isUserExists = await this.prisma.user.findUnique({
      where: {
        email: createUserDto.email,
      },
    });

    if (isUserExists) throw new Error('User already exists'); // why does this not return the error in the response ?

    // TODO: Hash password here
    

    const dbUser = {
      email: createUserDto.email,
      password_hash: createUserDto.password, // This should be hashed before saving
      full_name: createUserDto.full_name,
      role: createUserDto.role,
    }

    return this.prisma.user.create({
      data: dbUser,
      select: {
        id: true,
        email: true,
        full_name: true,
        role: true,
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

    if (!foundUser) {
      throw new Error('User not found'); // TODO: Still returns a 500 error, need to handle this properly
    };

    return foundUser;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      select: {
        id: true,
        email: true,
        full_name: true,
        role: true,
      },
    });

    return {
      code: 200,
      message: 'User updated successfully',
      data: updatedUser
    }
  }

  async remove(id: string) {
    const deletedUser = await this.prisma.user.delete({
      where: { id },
      select: {
        id: true,
        email: true,
        full_name: true,
        role: true,
      },
    });

    return {
      code: 200,
      message: 'User deleted successfully',
      data: deletedUser,
    }
  }
}
