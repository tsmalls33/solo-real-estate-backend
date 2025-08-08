import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const isUserExists = await this.prisma.user.findUnique({
      where: {
        email: createUserDto.email,
      },
    });

    if (isUserExists) throw new Error('User already exists');

    // TODO: Hash password here
    

    const dbUser = {
      email: createUserDto.email,
      password_hash: createUserDto.password, // This should be hashed before saving
      full_name: createUserDto.full_name,
      role: createUserDto.role,
    }

    return this.prisma.user.create({
      data: dbUser,
    });
  }
  
  // async findAll() {
  //   const allUsers = await this.prisma.user.findAll();
  //   return allUsers; // Does this return the format we need ? Print test this to see what it returns.
  // }
  
  // findAll() {
  //   return `This action returns all user`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} user`;
  // }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
