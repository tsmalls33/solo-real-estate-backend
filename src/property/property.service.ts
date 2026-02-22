import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { GetPropertiesQueryParams } from './dto/get-properties-query-params';
import { GetReservationsQueryParams } from './dto/get-reservations-query-params';
import { GetCostsQueryParams } from './dto/get-costs-query-params';
import { PropertyRepository } from './property.repository';

@Injectable()
export class PropertyService {
  constructor(private readonly propertyRepository: PropertyRepository) {}

  async create(dto: CreatePropertyDto) {
    return this.propertyRepository.create(dto as Prisma.PropertyUncheckedCreateInput);
  }

  async findAll(query: GetPropertiesQueryParams) {
    return this.propertyRepository.findAll({
      status: query.status,
      saleType: query.saleType,
      id_tenant: query.id_tenant,
      id_agent: query.id_agent,
      page: query.page ?? 1,
      limit: query.limit ?? 20,
    });
  }

  async findOne(id_property: string) {
    const property = await this.propertyRepository.findById(id_property);
    if (!property)
      throw new NotFoundException(`Property with id '${id_property}' not found`);
    return property;
  }

  async update(id_property: string, dto: UpdatePropertyDto) {
    const exists = await this.propertyRepository.existsById(id_property);
    if (!exists)
      throw new NotFoundException(`Property with id '${id_property}' not found`);

    return this.propertyRepository.update(
      id_property,
      dto as Prisma.PropertyUncheckedUpdateInput,
    );
  }

  async remove(id_property: string) {
    const exists = await this.propertyRepository.existsById(id_property);
    if (!exists)
      throw new NotFoundException(`Property with id '${id_property}' not found`);
    return this.propertyRepository.softDelete(id_property);
  }

  async findReservations(
    id_property: string,
    query: GetReservationsQueryParams,
  ) {
    const exists = await this.propertyRepository.existsById(id_property);
    if (!exists)
      throw new NotFoundException(`Property with id '${id_property}' not found`);
    return this.propertyRepository.findReservations(id_property, {
      startDate: query.startDate,
      endDate: query.endDate,
      status: query.status,
      platform: query.platform,
    });
  }

  async findCosts(id_property: string, query: GetCostsQueryParams) {
    const exists = await this.propertyRepository.existsById(id_property);
    if (!exists)
      throw new NotFoundException(`Property with id '${id_property}' not found`);
    return this.propertyRepository.findCosts(id_property, {
      startDate: query.startDate,
      endDate: query.endDate,
      costType: query.costType,
      id_reservation: query.id_reservation,
    });
  }
}
