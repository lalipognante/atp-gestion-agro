import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateLeaseContractDto } from './dto/create-lease-contract.dto';
import { CreateLeaseDeliveryDto } from './dto/create-lease-delivery.dto';
import { Currency, FinancialDirection } from '@prisma/client';

@Injectable()
export class LeaseContractsService {
  constructor(private readonly prisma: PrismaService) {}

  async createContract(dto: CreateLeaseContractDto) {
    const field = await this.prisma.field.findUnique({ where: { id: dto.fieldId } });
    if (!field) throw new NotFoundException('Field not found');

    return this.prisma.leaseContract.create({
      data: {
        fieldId: dto.fieldId,
        year: dto.year,
        totalQuintales: dto.totalQuintales,
        notes: dto.notes ?? null,
      },
      include: { field: true, deliveries: true },
    });
  }

  async findContractsByField(fieldId?: string) {
    return this.prisma.leaseContract.findMany({
      where: {
        deletedAt: null,
        ...(fieldId ? { fieldId } : {}),
      },
      include: {
        field: true,
        deliveries: {
          where: { deletedAt: null },
          orderBy: { date: 'desc' },
        },
      },
      orderBy: { year: 'desc' },
    });
  }

  async findAllContracts() {
    return this.findContractsByField();
  }

  async createDelivery(dto: CreateLeaseDeliveryDto) {
    const contract = await this.prisma.leaseContract.findUnique({
      where: { id: dto.contractId },
      include: { deliveries: { where: { deletedAt: null } } },
    });
    if (!contract) throw new NotFoundException('Contract not found');
    if (contract.deletedAt) throw new BadRequestException('Contract is voided');

    // Check we don't exceed total
    const delivered = contract.deliveries.reduce(
      (acc, d) => acc + Number(d.quintales),
      0,
    );
    if (delivered + dto.quintales > Number(contract.totalQuintales)) {
      throw new BadRequestException(
        `Supera el total del contrato. Restante: ${Number(contract.totalQuintales) - delivered} qq`,
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const fm = await tx.financialMovement.create({
        data: {
          direction: FinancialDirection.EXPENSE,
          category: 'LEASE_PAYMENT',
          amount: dto.amountARS,
          currency: Currency.ARS,
          exchangeRateAtCreation: 1,
          baseCurrencyAmount: dto.amountARS,
          paymentMethod: dto.paymentMethod,
          reference: dto.reference ?? null,
          notes: dto.notes
            ? `Entrega ${dto.quintales}qq | ${dto.notes}`
            : `Entrega ${dto.quintales}qq`,
          createdAt: new Date(dto.date),
        },
      });

      return tx.leaseDelivery.create({
        data: {
          contractId: dto.contractId,
          date: new Date(dto.date),
          quintales: dto.quintales,
          amountARS: dto.amountARS,
          paymentMethod: dto.paymentMethod,
          reference: dto.reference ?? null,
          notes: dto.notes ?? null,
          financialMovementId: fm.id,
        },
        include: { contract: { include: { field: true } } },
      });
    });
  }

  async voidContract(id: string) {
    const c = await this.prisma.leaseContract.findUnique({ where: { id } });
    if (!c) throw new NotFoundException('Contract not found');
    if (c.deletedAt) throw new BadRequestException('Already voided');
    return this.prisma.leaseContract.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async voidDelivery(id: string) {
    const d = await this.prisma.leaseDelivery.findUnique({ where: { id } });
    if (!d) throw new NotFoundException('Delivery not found');
    if (d.deletedAt) throw new BadRequestException('Already voided');
    return this.prisma.leaseDelivery.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async getContractSummary(fieldId: string) {
    const contracts = await this.findContractsByField(fieldId);
    return contracts.map((c) => {
      const delivered = c.deliveries.reduce((acc, d) => acc + Number(d.quintales), 0);
      return {
        ...c,
        deliveredQuintales: delivered,
        remainingQuintales: Number(c.totalQuintales) - delivered,
      };
    });
  }
}
