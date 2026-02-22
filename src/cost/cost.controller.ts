import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserRoles } from '@RealEstate/types';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CostService } from './cost.service';
import { CreateCostDto } from './dto/create-cost.dto';
import { UpdateCostDto } from './dto/update-cost.dto';
import { GetCostsQueryParams } from './dto/get-costs-query-params';

@ApiTags('Cost')
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRoles.SUPERADMIN)
@Controller('costs')
export class CostController {
  constructor(private readonly costService: CostService) {}

  @Get()
  findAll(
    @Query(new ValidationPipe({ transform: true })) query: GetCostsQueryParams,
  ) {
    return this.costService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.costService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateCostDto) {
    return this.costService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCostDto) {
    return this.costService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.costService.remove(id);
  }
}
