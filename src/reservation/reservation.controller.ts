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
import { CostService } from '../cost/cost.service';
import { CreateReservationCostDto } from '../cost/dto/create-reservation-cost.dto';
import { UpdateCostDto } from '../cost/dto/update-cost.dto';
import { GetCostsQueryParams } from '../cost/dto/get-costs-query-params';

@ApiTags('Reservation')
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRoles.SUPERADMIN)
@Controller('reservations')
export class ReservationController {
  constructor(private readonly costService: CostService) {}

  /** GET /reservations/:id_reservation/costs */
  @Get(':id_reservation/costs')
  findCosts(
    @Param('id_reservation') id_reservation: string,
    @Query(new ValidationPipe({ transform: true })) query: GetCostsQueryParams,
  ) {
    return this.costService.findAll({ ...query, id_reservation });
  }

  /** POST /reservations/:id_reservation/costs */
  @Post(':id_reservation/costs')
  createCost(
    @Param('id_reservation') id_reservation: string,
    @Body() dto: CreateReservationCostDto,
  ) {
    return this.costService.create({ ...dto, id_reservation });
  }

  /** PATCH /reservations/:id_reservation/costs/:id_cost */
  @Patch(':id_reservation/costs/:id_cost')
  updateCost(
    @Param('id_cost') id_cost: string,
    @Body() dto: UpdateCostDto,
  ) {
    return this.costService.update(id_cost, dto);
  }

  /** DELETE /reservations/:id_reservation/costs/:id_cost */
  @Delete(':id_reservation/costs/:id_cost')
  deleteCost(@Param('id_cost') id_cost: string) {
    return this.costService.remove(id_cost);
  }
}
