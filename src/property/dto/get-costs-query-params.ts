import { IsDateString, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CostType } from '@prisma/client';

export class GetCostsQueryParams {
  @ApiPropertyOptional({ example: '2026-01-01' })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({ example: '2026-12-31' })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiPropertyOptional({ enum: CostType })
  @IsEnum(CostType)
  @IsOptional()
  costType?: CostType;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  id_reservation?: string;
}
