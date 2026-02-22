export const CostType = {
  CLEANING: 'CLEANING',
  TAX: 'TAX',
  PLATFORM_FEE: 'PLATFORM_FEE',
  OTHER: 'OTHER',
} as const;

export type CostType = (typeof CostType)[keyof typeof CostType];

export class GetCostsQueryParams {
  costType?: CostType;
  id_property?: string;
  id_reservation?: string;
  page?: number;
  limit?: number;
}

export class CreateCostDto {
  costType!: CostType;
  date!: string;
  amount!: number;
  id_property?: string;
  id_reservation?: string;
}

export class CreatePropertyCostDto {
  costType!: CostType;
  date!: string;
  amount!: number;
  id_reservation?: string;
}

export class CreateReservationCostDto {
  costType!: CostType;
  date!: string;
  amount!: number;
}

export class UpdateCostDto {
  costType?: CostType;
  date?: string;
  amount?: number;
  id_property?: string;
  id_reservation?: string;
}
