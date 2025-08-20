import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma/prisma.service';
import { SignInDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signup.dto';


@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly prismaService: PrismaService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (!user || !(await this.userService.comparePassword(password, user.password_hash))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  async signin(SignInDto) {
    // TODO: Implement your signin logic here, e.g., generating JWT tokens
    const { email, password } = SignInDto;
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // Here you would typically generate a JWT token or session token
    // For simplicity, let's assume we return a dummy token
    return { accessToken: 'dummy-signin-token' }; // Replace with actual token generation logic
  }

  async signup(SignUpDto) {
    const { email, password } = SignUpDto;
    // Create a new user
    const newUser = await this.userService.create({
      email,
      password, // Ensure to hash the password in the user service
    });
    // Here you would typically generate a JWT token or session token
    // For simplicity, let's assume we return a dummy token
    return { accessToken: 'dummy-signup-token' }; // Replace with actual token generation logic

  }

}
