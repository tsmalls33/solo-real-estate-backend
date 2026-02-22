import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AgentPaymentRepository } from './agent-payment.repository';
import { CreateAgentPaymentDto } from './dto/create-agent-payment.dto';
import { UpdateAgentPaymentDto } from './dto/update-agent-payment.dto';
import { GetAgentPaymentsQueryParams } from './dto/get-agent-payments-query-params';

@Injectable()
export class AgentPaymentService {
  constructor(private readonly agentPaymentRepository: AgentPaymentRepository) {}

  async create(dto: CreateAgentPaymentDto) {
    return this.agentPaymentRepository.create(dto as Prisma.AgentPaymentUncheckedCreateInput);
  }

  async findAll(query: GetAgentPaymentsQueryParams) {
    return this.agentPaymentRepository.findAll({
      isPaid: query.isPaid,
      id_user: query.id_user,
      startDate: query.startDate,
      endDate: query.endDate,
      page: query.page ?? 1,
      limit: query.limit ?? 20,
    });
  }

  async findOne(id_agent_payment: string) {
    const payment = await this.agentPaymentRepository.findById(id_agent_payment);
    if (!payment) throw new NotFoundException(`AgentPayment '${id_agent_payment}' not found`);
    return payment;
  }

  async update(id_agent_payment: string, dto: UpdateAgentPaymentDto) {
    const exists = await this.agentPaymentRepository.existsById(id_agent_payment);
    if (!exists) throw new NotFoundException(`AgentPayment '${id_agent_payment}' not found`);
    return this.agentPaymentRepository.update(
      id_agent_payment,
      dto as Prisma.AgentPaymentUncheckedUpdateInput,
    );
  }

  async remove(id_agent_payment: string) {
    const exists = await this.agentPaymentRepository.existsById(id_agent_payment);
    if (!exists) throw new NotFoundException(`AgentPayment '${id_agent_payment}' not found`);
    return this.agentPaymentRepository.delete(id_agent_payment);
  }
}
