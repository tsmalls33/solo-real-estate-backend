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
import { GetCostsQueryParams } from './dto/get-costs-query-params';
import { PropertyService } from './property.service';

@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRoles.SUPERADMIN)
@ApiTags('Property')
@Controller('properties')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

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

  /** GET /properties/:id_property — full detail with stats, photos, feeRules */
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

  /** DELETE /properties/:id_property — soft-delete (isDeleted=true) */
  @Delete(':id_property')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Property deleted successfully')
  remove(@Param('id_property') id_property: string) {
    return this.propertyService.remove(id_property);
  }

  /** GET /properties/:id_property/reservations?startDate=&endDate=&status=&platform= */
  @Get(':id_property/reservations')
  @ResponseMessage('Reservations fetched successfully')
  findReservations(
    @Param('id_property') id_property: string,
    @Query(new ValidationPipe({ transform: true })) query: GetReservationsQueryParams,
  ) {
    return this.propertyService.findReservations(id_property, query);
  }

  /** GET /properties/:id_property/costs?startDate=&endDate=&costType=&id_reservation= */
  @Get(':id_property/costs')
  @ResponseMessage('Costs fetched successfully')
  findCosts(
    @Param('id_property') id_property: string,
    @Query(new ValidationPipe({ transform: true })) query: GetCostsQueryParams,
  ) {
    return this.propertyService.findCosts(id_property, query);
  }
}
