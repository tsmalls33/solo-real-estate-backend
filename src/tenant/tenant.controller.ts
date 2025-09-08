import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TenantService } from './tenant.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../user/user-roles';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.SUPERADMIN)
@Controller('tenant')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Post()
  create(@Body() createTenantDto: CreateTenantDto) {
    return this.tenantService.create(createTenantDto);
  }

  @Get()
  findAll() {
    return this.tenantService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tenantService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateTenantDto: UpdateTenantDto) {
    return this.tenantService.update(id, updateTenantDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tenantService.remove(id);
  }
}
