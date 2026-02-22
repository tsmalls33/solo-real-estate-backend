import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AGENT_PAYMENT_SELECT } from './projections/agent-payment.projection';

@Injectable()
export class AgentPaymentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.AgentPaymentUncheckedCreateInput) {
    return this.prisma.agentPayment.create({ data, select: AGENT_PAYMENT_SELECT });
  }

  async findAll(params: {
    isPaid?: boolean;
    id_user?: string;
    startDate?: string;
    endDate?: string;
    page: number;
    limit: number;
  }) {
    const { isPaid, id_user, startDate, endDate, page, limit } = params;

    const where: Prisma.AgentPaymentWhereInput = {
      ...(isPaid !== undefined && { isPaid }),
      ...(id_user && { id_user }),
      ...((startDate || endDate) && {
        dueDate: {
          ...(startDate && { gte: new Date(startDate) }),
          ...(endDate && { lte: new Date(endDate) }),
        },
      }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.agentPayment.findMany({
        where,
        select: AGENT_PAYMENT_SELECT,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { dueDate: 'asc' },
      }),
      this.prisma.agentPayment.count({ where }),
    ]);

    return { data, total };
  }

  async findById(id_agent_payment: string) {
    return this.prisma.agentPayment.findUnique({
      where: { id_agent_payment },
      select: AGENT_PAYMENT_SELECT,
    });
  }

  async existsById(id_agent_payment: string) {
    return this.prisma.agentPayment.findUnique({
      where: { id_agent_payment },
      select: { id_agent_payment: true },
    });
  }

  async update(id_agent_payment: string, data: Prisma.AgentPaymentUncheckedUpdateInput) {
    return this.prisma.agentPayment.update({
      where: { id_agent_payment },
      data,
      select: AGENT_PAYMENT_SELECT,
    });
  }

  async delete(id_agent_payment: string) {
    return this.prisma.agentPayment.delete({
      where: { id_agent_payment },
      select: AGENT_PAYMENT_SELECT,
    });
  }
}
