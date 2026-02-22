import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { TenantModule } from './tenant/tenant.module';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './auth/auth.guard';
import { RolesGuard } from './auth/roles.guard';
import { ThemeModule } from './theme/theme.module';
import { PlanModule } from './plan/plan.module';
import { PropertyModule } from './property/property.module';
import { ClientModule } from './client/client.module';
import { AgentPaymentModule } from './agent-payment/agent-payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
    }),
    PrismaModule,
    UserModule,
    TenantModule,
    AuthModule,
    ThemeModule,
    PlanModule,
    PropertyModule,
    ClientModule,
    AgentPaymentModule,
  ],
  controllers: [AppController],
  providers: [AppService, AuthGuard, RolesGuard],
})
export class AppModule {}
