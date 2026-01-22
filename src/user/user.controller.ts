import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRoles } from '@RealEstate/types';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { ParseUUIDPipe } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  @ResponseMessage('User created successfully')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.SUPERADMIN)
  create(@Body() input: CreateUserDto) {
    return this.userService.createUser(input);
  }

  @Get()
  @ResponseMessage('Users fetched successfully')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.SUPERADMIN)
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @ResponseMessage('User fetched successfully')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Put(':id')
  @ResponseMessage('User updated successfully')
  update(@Param('id') id: string, @Body() input: UpdateUserDto) {
    return this.userService.update(id, input);
  }

  @Delete(':id')
  @ResponseMessage('User deleted successfully')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.SUPERADMIN)
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
