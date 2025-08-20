import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto'; 
import { SignUpDto } from './dto/signup.dto'; 
import { AuthGuard } from './auth.guard'; 
import { RefreshTokenDto } from './dto/refresh-token.dto'; 

@Controller('auth')
export class AuthController {
constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signin(@Body() signInDto: SignInDto) {
    return this.authService.signin(signInDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signup')
  async signup(@Body() signUpDto: SignUpDto) {
    return this.authService.signup(signUpDto);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    // The user information is available in req.user due to the AuthGuard
    return req.user; // Return the user profile information
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshToken(dto.refreshToken);
  }

}
