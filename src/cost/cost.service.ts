import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CostType, Prisma } from '@prisma/client';
import { CostRepository } from './cost.repository';
import { GetCostsQueryParams } from './dto/get-costs-query-params';
import { UpdateCostDto } from './dto/update-cost.dto';

/** Flexible input accepted by create() — covers all calling contexts. */
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

  /**
   * Creates a cost record.
   *
   * Invariant enforcement (service layer):
   * - If id_reservation is provided without id_property: auto-derive id_property
   *   from the reservation (reservation.id_property).
   * - If both are provided: cross-check that id_property matches the reservation's
   *   property — throws BadRequestException on mismatch.
   *
   * Note: the @AtLeastOneOf guard on CreateCostDto already catches the case where
   * both are absent for direct POST /costs. Sub-resource controllers always supply
   * their own FK from the URL, so that check is not duplicated here.
   */
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

      // Auto-derive id_property so the cost is always anchored to a property
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

  /**
   * Updates a cost record.
   *
   * Ownership invariant is re-checked after merging the incoming DTO fields
   * with the existing DB values, so a PATCH that only changes `amount` still
   * passes if the existing FKs are valid.
   */
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
