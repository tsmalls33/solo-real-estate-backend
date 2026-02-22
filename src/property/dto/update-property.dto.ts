import { IsEnum, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';
import { PropertyStatus } from '@prisma/client';
import { CreatePropertyDto } from './create-property.dto';

export class UpdatePropertyDto extends PartialType(CreatePropertyDto) {
  @ApiPropertyOptional({ enum: PropertyStatus })
  @IsEnum(PropertyStatus)
  @IsOptional()
  status?: PropertyStatus;
}
