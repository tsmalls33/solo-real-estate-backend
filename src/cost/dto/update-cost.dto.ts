import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CostType } from '@prisma/client';

/**
 * No @AtLeastOneOf here — PATCH only sends changed fields.
 * CostService.update() merges the incoming body with the existing DB record
 * before validating the invariant (at least one FK must remain non-null).
 */
export class UpdateCostDto {
  @ApiProperty({ enum: CostType, required: false })
  @IsOptional()
  @IsEnum(CostType)
  costType?: CostType;

  @ApiProperty({ required: false, example: '2026-01-15' })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiProperty({ required: false, example: 150.0 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Type(() => Number)
  amount?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  id_property?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  id_reservation?: string;
}
