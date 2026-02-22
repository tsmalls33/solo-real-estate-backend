import { Injectable } from '@nestjs/common';
import {
  CostType,
  Platform,
  Prisma,
  Property,
  PropertyStatus,
  ReservationStatus,
  SaleType,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  PROPERTY_DETAIL_SELECT,
  PROPERTY_LIST_SELECT,
} from './projections/property.projection';

@Injectable()
export class PropertyRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.PropertyUncheckedCreateInput): Promise<Property> {
    return (await this.prisma.property.create({
      data,
      select: PROPERTY_LIST_SELECT,
    })) as Property;
  }

  async findAll(filters: {
    status?: PropertyStatus;
    saleType?: SaleType;
    id_tenant?: string;
    id_agent?: string;
    page: number;
    limit: number;
  }): Promise<{ data: Property[]; total: number }> {
    const { page, limit, ...filterFields } = filters;
    const skip = (page - 1) * limit;

    const where: Prisma.PropertyWhereInput = {
      isDeleted: false,
      ...(filterFields.status && { status: filterFields.status }),
      ...(filterFields.saleType && { saleType: filterFields.saleType }),
      ...(filterFields.id_tenant && { id_tenant: filterFields.id_tenant }),
      ...(filterFields.id_agent && { id_agent: filterFields.id_agent }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.property.findMany({
        where,
        select: PROPERTY_LIST_SELECT,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.property.count({ where }),
    ]);

    return { data: data as Property[], total };
  }

  async findById(id_property: string): Promise<Property | null> {
    return (await this.prisma.property.findUnique({
      where: { id_property, isDeleted: false },
      select: PROPERTY_DETAIL_SELECT,
    })) as Property | null;
  }

  async existsById(id_property: string): Promise<boolean> {
    const property = await this.prisma.property.findUnique({
      where: { id_property },
      select: { id_property: true },
    });
    return property !== null;
  }

  async update(
    id_property: string,
    data: Prisma.PropertyUncheckedUpdateInput,
  ): Promise<Property> {
    return (await this.prisma.property.update({
      where: { id_property },
      data,
      select: PROPERTY_LIST_SELECT,
    })) as Property;
  }

  async softDelete(id_property: string): Promise<Property> {
    return (await this.prisma.property.update({
      where: { id_property },
      data: { isDeleted: true },
      select: PROPERTY_LIST_SELECT,
    })) as Property;
  }

  async findReservations(
    id_property: string,
    filters: {
      startDate?: string;
      endDate?: string;
      status?: ReservationStatus;
      platform?: Platform;
    },
  ) {
    return this.prisma.reservation.findMany({
      where: {
        id_property,
        ...(filters.status && { status: filters.status }),
        ...(filters.platform && { platform: filters.platform }),
        ...((filters.startDate || filters.endDate) && {
          startDate: {
            ...(filters.startDate && { gte: new Date(filters.startDate) }),
            ...(filters.endDate && { lte: new Date(filters.endDate) }),
          },
        }),
      },
      orderBy: { startDate: 'desc' },
    });
  }

  async findCosts(
    id_property: string,
    filters: {
      startDate?: string;
      endDate?: string;
      costType?: CostType;
      id_reservation?: string;
    },
  ) {
    return this.prisma.cost.findMany({
      where: {
        id_property,
        ...(filters.costType && { costType: filters.costType }),
        ...(filters.id_reservation && {
          id_reservation: filters.id_reservation,
        }),
        ...((filters.startDate || filters.endDate) && {
          date: {
            ...(filters.startDate && { gte: new Date(filters.startDate) }),
            ...(filters.endDate && { lte: new Date(filters.endDate) }),
          },
        }),
      },
      orderBy: { date: 'desc' },
    });
  }
}
