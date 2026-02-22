import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CostType } from '@RealEstate/types';
import { CostRepository } from './cost.repository';
import { GetCostsQueryParams } from './dto/get-costs-query-params';
import { UpdateCostDto } from './dto/update-cost.dto';

interface CreateCostData {
  costType: CostType;
  date: string;
  amount: number;
  id_property?: string;
  id_reservation?: string;
}

@Injectable()
export class CostService {
  constructor(private readonly costRepository: CostRepository) {}

  async create(data: CreateCostData) {
    let { id_property, id_reservation } = data;

    if (id_reservation) {
      const reservationProperty =
        await this.costRepository.findReservationProperty(id_reservation);

      if (reservationProperty === null) {
        throw new NotFoundException(
          `Reservation '${id_reservation}' not found`,
        );
      }

      if (id_property && id_property !== reservationProperty) {
        throw new BadRequestException(
          'id_property does not match the property of the given reservation',
        );
      }

      id_property = reservationProperty;
    }

    return this.costRepository.create({
      costType: data.costType,
      date: new Date(data.date),
      amount: data.amount,
      id_property,
      id_reservation,
    } as Prisma.CostUncheckedCreateInput);
  }

  async findAll(query: GetCostsQueryParams) {
    return this.costRepository.findAll({
      costType: query.costType,
      id_property: query.id_property,
      id_reservation: query.id_reservation,
      page: query.page ?? 1,
      limit: query.limit ?? 20,
    });
  }

  async findOne(id_cost: string) {
    const cost = await this.costRepository.findById(id_cost);
    if (!cost) throw new NotFoundException(`Cost '${id_cost}' not found`);
    return cost;
  }

  async update(id_cost: string, dto: UpdateCostDto) {
    const existing = await this.costRepository.existsById(id_cost);
    if (!existing) throw new NotFoundException(`Cost '${id_cost}' not found`);

    const effectiveProperty = dto.id_property ?? existing.id_property;
    const effectiveReservation = dto.id_reservation ?? existing.id_reservation;

    if (!effectiveProperty && !effectiveReservation) {
      throw new BadRequestException(
        'Cost must retain at least one of id_property or id_reservation',
      );
    }

    if (effectiveReservation) {
      const reservationProperty =
        await this.costRepository.findReservationProperty(effectiveReservation);

      if (reservationProperty === null) {
        throw new NotFoundException(
          `Reservation '${effectiveReservation}' not found`,
        );
      }

      if (effectiveProperty && effectiveProperty !== reservationProperty) {
        throw new BadRequestException(
          'id_property does not match the property of the given reservation',
        );
      }
    }

    const updateData: Prisma.CostUncheckedUpdateInput = {
      ...dto,
      ...(dto.date && { date: new Date(dto.date) }),
    };

    return this.costRepository.update(id_cost, updateData);
  }

  async remove(id_cost: string) {
    const exists = await this.costRepository.existsById(id_cost);
    if (!exists) throw new NotFoundException(`Cost '${id_cost}' not found`);
    return this.costRepository.delete(id_cost);
  }
}
