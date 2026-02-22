import { Injectable, NotFoundException } from '@nestjs/common';
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
    return this.propertyRepository.create({
      propertyName: dto.propertyName,
      propertyAddress: dto.propertyAddress,
      ...(dto.propertyDescription && {
        propertyDescription: dto.propertyDescription,
      }),
      ...(dto.coverImage && { coverImage: dto.coverImage }),
      ...(dto.agentFeePercentage !== undefined && {
        agentFeePercentage: dto.agentFeePercentage,
      }),
      ...(dto.salePrice !== undefined && { salePrice: dto.salePrice }),
      ...(dto.saleType && { saleType: dto.saleType }),
      ...(dto.id_owner && { id_owner: dto.id_owner }),
      ...(dto.id_agent && { id_agent: dto.id_agent }),
      ...(dto.id_tenant && { id_tenant: dto.id_tenant }),
    });
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

    const data: Record<string, any> = {};
    if (dto.propertyName !== undefined) data.propertyName = dto.propertyName;
    if (dto.propertyAddress !== undefined)
      data.propertyAddress = dto.propertyAddress;
    if (dto.propertyDescription !== undefined)
      data.propertyDescription = dto.propertyDescription;
    if (dto.coverImage !== undefined) data.coverImage = dto.coverImage;
    if (dto.agentFeePercentage !== undefined)
      data.agentFeePercentage = dto.agentFeePercentage;
    if (dto.salePrice !== undefined) data.salePrice = dto.salePrice;
    if (dto.saleType !== undefined) data.saleType = dto.saleType;
    if (dto.status !== undefined) data.status = dto.status;
    if (dto.id_owner !== undefined) data.id_owner = dto.id_owner;
    if (dto.id_agent !== undefined) data.id_agent = dto.id_agent;
    if (dto.id_tenant !== undefined) data.id_tenant = dto.id_tenant;

    return this.propertyRepository.update(id_property, data);
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
