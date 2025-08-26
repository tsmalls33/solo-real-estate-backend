import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ResponseMessage('User created successfully')
  create(@Body() input: CreateUserDto) {
    return this.userService.create(input);
  }

  @Get()
  @ResponseMessage('Users fetched successfully')
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
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
