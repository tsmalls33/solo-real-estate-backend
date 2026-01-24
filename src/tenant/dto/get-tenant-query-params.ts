import { GetTenantQueryParams as SharedGetTenantQueryParams } from "@RealEstate/types";
import { IsBooleanString, IsOptional } from "class-validator";
import { Transform } from "class-transformer";

export class GetTenantQueryParams implements SharedGetTenantQueryParams {
  @IsOptional()
  @IsBooleanString()
  @Transform(({ value }) => value === 'ture')
  includeUsers?: boolean
}
