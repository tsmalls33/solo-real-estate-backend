import { Module } from '@nestjs/common';
import { CostModule } from '../cost/cost.module';
import { ReservationController } from './reservation.controller';

@Module({
  imports: [CostModule],
  controllers: [ReservationController],
})
export class ReservationModule {}
