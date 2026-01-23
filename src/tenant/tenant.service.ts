import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { PrismaService } from '../prisma/prisma.service';
import { TENANT_PUBLIC_SELECT, TENANT_WITH_USERS_SELECT } from './projections/tenant.projection';
import { TenantEntity } from '@RealEstate/types'


@Injectable()
export class TenantService {
  constructor(private readonly prisma: PrismaService) { }

  async createTenant(createTenantDto: CreateTenantDto): Promise<TenantEntity> {
    const isTenantExists = await this.prisma.tenant.findUnique({
      where: {
        name: createTenantDto.name,
      },
    });

    if (isTenantExists) throw new ConflictException('Tenant already exists'); // returns 409 Conflict

    const dbTenant = {
      name: createTenantDto.name,
      customDomain: createTenantDto.customDomain,
      id_plan: createTenantDto.id_plan,
    };

    return this.prisma.tenant.create({
      data: dbTenant
    });
  }

  async findAll(): Promise<TenantEntity[]> {
    return this.prisma.tenant.findMany();
  }

  async findOne(id_tenant: string) {
    const foundTenant = await this.prisma.tenant.findUnique({
      where: { id_tenant },
      select: TENANT_WITH_USERS_SELECT,
    });

    if (!foundTenant)
      throw new NotFoundException(`Tenant withid_tenant${id_tenant} not found`); // returns 404 Not Found

    return foundTenant;
  }

  async update(id_tenant: string, input: UpdateTenantDto) {
    // check if at least one field is provided for update
    if (
      !input.name &&
      !input.customDomain &&
      !input.id_plan
    ) {
      throw new ConflictException('No fields to update'); // returns 409 Conflict
    }

    // check if tenant name is being updated and if it already exists
    if (input.name) {
      const isTenantExists = await this.prisma.tenant.findUnique({
        where: {
          name: input.name,
        },
      });

      if (isTenantExists) {
        throw new ConflictException(`Tenant name '${input.name}' already exists`);
      }
    }

    // check if tenant exists
    const foundTenant = await this.prisma.tenant.findUnique({
      where: { id_tenant },
    });

    if (!foundTenant)
      throw new NotFoundException(`Tenant with id ${id_tenant} not found`); // returns 404 Not Found

    // update tenant with provided fields
    const updatedTenant = await this.prisma.tenant.update({
      where: { id_tenant },
      data: input,
      select: TENANT_PUBLIC_SELECT,
    });

    return updatedTenant;
  }

  async remove(id_tenant: string) {
    // check if tenant exists
    const foundTenant = await this.prisma.tenant.findUnique({
      where: { id_tenant },
    });

    if (!foundTenant)
      throw new NotFoundException(`Tenant withid_tenant${id_tenant} not found`); // returns 404 Not Found

    // delete tenant
    const deletedTenant = await this.prisma.tenant.delete({
      where: { id_tenant },
      select: TENANT_PUBLIC_SELECT,
    });

    return deletedTenant;
  }
}
