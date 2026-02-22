import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserRoles } from '@RealEstate/types';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { AgentPaymentService } from './agent-payment.service';
import { CreateAgentPaymentDto } from './dto/create-agent-payment.dto';
import { UpdateAgentPaymentDto } from './dto/update-agent-payment.dto';
import { GetAgentPaymentsQueryParams } from './dto/get-agent-payments-query-params';

@ApiTags('AgentPayment')
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRoles.SUPERADMIN)
@Controller('agent-payments')
export class AgentPaymentController {
  constructor(private readonly agentPaymentService: AgentPaymentService) {}

  @Get()
  findAll(@Query() query: GetAgentPaymentsQueryParams) {
    return this.agentPaymentService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.agentPaymentService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateAgentPaymentDto) {
    return this.agentPaymentService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAgentPaymentDto) {
    return this.agentPaymentService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.agentPaymentService.remove(id);
  }
}
