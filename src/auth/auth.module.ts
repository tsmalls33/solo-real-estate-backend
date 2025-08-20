import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module'; // Import UserModule for user-related operations
import { PrismaModule } from '../prisma/prisma.module'; // Import PrismaModule for database

@Module({
  imports: [UserModule, PrismaModule], // Import necessary services
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
