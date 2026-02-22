import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsPositive,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CostType } from '@prisma/client';

/**
 * Used by POST /reservations/:id_reservation/costs.
 * id_reservation injected from URL; id_property is auto-derived from the reservation.
 */
export class CreateReservationCostDto {
  @ApiProperty({ enum: CostType })
  @IsEnum(CostType)
  costType: CostType;

  @ApiProperty({ example: '2026-01-15' })
  @IsDateString()
  date: string;

  @ApiProperty({ example: 150.0 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Type(() => Number)
  amount: number;
}
