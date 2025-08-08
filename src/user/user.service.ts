import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

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
  
  async findAll() {
    // Returns array of User objects --> User[]
    return await this.prisma.user.findMany({
      select: {
        id: true,
        email: true, 
        full_name: true,
        role: true,
      }
    });   }
  
  async findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        full_name: true,
        role: true,
      },
    }) 
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
