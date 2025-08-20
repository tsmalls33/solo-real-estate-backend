import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module'; // Import UserModule for user-related operations
import { PrismaModule } from '../prisma/prisma.module'; // Import PrismaModule for database
import { JwtModule } from '@nestjs/jwt'; // Import JwtModule for JWT operations

@Module({
  imports: [
    UserModule, 
    PrismaModule,
    JwtModule.register({
      global: true, // Make JWT module available globally
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60s' }, // Set token expiration time
    }), // Configure JWT module
  ], // Import necessary services
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService], // Export AuthService for use in other modules
})
export class AuthModule {}
