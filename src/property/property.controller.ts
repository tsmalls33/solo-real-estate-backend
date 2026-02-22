import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ResponseMessage } from '../common/decorators/response-message.decorator';
import { UserRoles } from '@RealEstate/types';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { GetPropertiesQueryParams } from './dto/get-properties-query-params';
import { GetReservationsQueryParams } from './dto/get-reservations-query-params';
import { PropertyService } from './property.service';
import { CostService } from '../cost/cost.service';
import { CreatePropertyCostDto } from '../cost/dto/create-property-cost.dto';
import { UpdateCostDto } from '../cost/dto/update-cost.dto';
import { GetCostsQueryParams } from '../cost/dto/get-costs-query-params';

@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRoles.SUPERADMIN)
@ApiTags('Property')
@Controller('properties')
export class PropertyController {
  constructor(
    private readonly propertyService: PropertyService,
    private readonly costService: CostService,
  ) {}

  /** POST /properties */
  @Post()
  @ResponseMessage('Property created successfully')
  create(@Body() createPropertyDto: CreatePropertyDto) {
    return this.propertyService.create(createPropertyDto);
  }

  /** GET /properties?status=&saleType=&id_tenant=&id_agent=&page=&limit= */
  @Get()
  @ResponseMessage('Properties fetched successfully')
  findAll(
    @Query(new ValidationPipe({ transform: true })) query: GetPropertiesQueryParams,
  ) {
    return this.propertyService.findAll(query);
  }

  /** GET /properties/:id_property */
  @Get(':id_property')
  @ResponseMessage('Property fetched successfully')
  findOne(@Param('id_property') id_property: string) {
    return this.propertyService.findOne(id_property);
  }

  /** PATCH /properties/:id_property */
  @Patch(':id_property')
  @ResponseMessage('Property updated successfully')
  update(
    @Param('id_property') id_property: string,
    @Body() updatePropertyDto: UpdatePropertyDto,
  ) {
    return this.propertyService.update(id_property, updatePropertyDto);
  }

  /** DELETE /properties/:id_property */
  @Delete(':id_property')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Property deleted successfully')
  remove(@Param('id_property') id_property: string) {
    return this.propertyService.remove(id_property);
  }

  /** GET /properties/:id_property/reservations */
  @Get(':id_property/reservations')
  @ResponseMessage('Reservations fetched successfully')
  findReservations(
    @Param('id_property') id_property: string,
    @Query(new ValidationPipe({ transform: true })) query: GetReservationsQueryParams,
  ) {
    return this.propertyService.findReservations(id_property, query);
  }

  /** GET /properties/:id_property/costs */
  @Get(':id_property/costs')
  @ResponseMessage('Costs fetched successfully')
  findCosts(
    @Param('id_property') id_property: string,
    @Query(new ValidationPipe({ transform: true })) query: GetCostsQueryParams,
  ) {
    return this.costService.findAll({ ...query, id_property });
  }

  /** POST /properties/:id_property/costs */
  @Post(':id_property/costs')
  @ResponseMessage('Cost created successfully')
  createCost(
    @Param('id_property') id_property: string,
    @Body() dto: CreatePropertyCostDto,
  ) {
    return this.costService.create({ ...dto, id_property });
  }

  /** PATCH /properties/:id_property/costs/:id_cost */
  @Patch(':id_property/costs/:id_cost')
  @ResponseMessage('Cost updated successfully')
  updateCost(
    @Param('id_cost') id_cost: string,
    @Body() dto: UpdateCostDto,
  ) {
    return this.costService.update(id_cost, dto);
  }

  /** DELETE /properties/:id_property/costs/:id_cost */
  @Delete(':id_property/costs/:id_cost')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Cost deleted successfully')
  deleteCost(@Param('id_cost') id_cost: string) {
    return this.costService.remove(id_cost);
  }
}
