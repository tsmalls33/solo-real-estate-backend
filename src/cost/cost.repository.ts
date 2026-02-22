import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CostType } from '@RealEstate/types';
import { PrismaService } from 'src/prisma/prisma.service';
import { COST_SELECT } from './projections/cost.projection';

@Injectable()
export class CostRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.CostUncheckedCreateInput) {
    return this.prisma.cost.create({ data, select: COST_SELECT });
  }

  async findAll(params: {
    costType?: CostType;
    id_property?: string;
    id_reservation?: string;
    page: number;
    limit: number;
  }) {
    const { costType, id_property, id_reservation, page, limit } = params;

    const where: Prisma.CostWhereInput = {
      ...(costType && { costType: costType as any }),
      ...(id_property && { id_property }),
      ...(id_reservation && { id_reservation }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.cost.findMany({
        where,
        select: COST_SELECT,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { date: 'desc' },
      }),
      this.prisma.cost.count({ where }),
    ]);

    return { data, total };
  }

  async findById(id_cost: string) {
    return this.prisma.cost.findUnique({
      where: { id_cost },
      select: COST_SELECT,
    });
  }

  async existsById(id_cost: string) {
    return this.prisma.cost.findUnique({
      where: { id_cost },
      select: { id_cost: true, id_property: true, id_reservation: true },
    });
  }

  async update(id_cost: string, data: Prisma.CostUncheckedUpdateInput) {
    return this.prisma.cost.update({
      where: { id_cost },
      data,
      select: COST_SELECT,
    });
  }

  async delete(id_cost: string) {
    return this.prisma.cost.delete({
      where: { id_cost },
      select: COST_SELECT,
    });
  }

  async findReservationProperty(id_reservation: string): Promise<string | null> {
    const res = await this.prisma.reservation.findUnique({
      where: { id_reservation },
      select: { id_property: true },
    });
    return res?.id_property ?? null;
  }
}
