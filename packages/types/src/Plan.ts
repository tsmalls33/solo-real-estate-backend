export const PlanPeriod = {
  MONTHLY: 'MONTHLY',
  YEARLY: 'YEARLY'
} as const

export type PlanPeriod = (typeof PlanPeriod)[keyof typeof PlanPeriod]
