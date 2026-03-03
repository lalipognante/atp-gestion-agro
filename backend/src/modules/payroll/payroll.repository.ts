import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSalaryPaymentDto } from './dto/create-salary-payment.dto';
import { CreateSalaryAdvanceDto } from './dto/create-salary-advance.dto';
import { Currency, FinancialDirection } from '@prisma/client';

@Injectable()
export class PayrollRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createPayment(dto: CreateSalaryPaymentDto) {
    return this.prisma.$transaction(async (tx) => {
      const fm = await tx.financialMovement.create({
        data: {
          direction: FinancialDirection.EXPENSE,
          category: 'SUELDO',
          amount: dto.amount,
          currency: Currency.ARS,
          exchangeRateAtCreation: 1,
          baseCurrencyAmount: dto.amount,
          notes: dto.notes ?? null,
          createdAt: new Date(dto.date),
        },
      });

      return tx.salaryPayment.create({
        data: {
          employeeId: dto.employeeId,
          date: new Date(dto.date),
          amount: dto.amount,
          notes: dto.notes ?? null,
          financialMovementId: fm.id,
        },
        include: { employee: true },
      });
    });
  }

  async createAdvance(dto: CreateSalaryAdvanceDto) {
    return this.prisma.$transaction(async (tx) => {
      const fm = await tx.financialMovement.create({
        data: {
          direction: FinancialDirection.EXPENSE,
          category: 'ADELANTO_SUELDO',
          amount: dto.amount,
          currency: Currency.ARS,
          exchangeRateAtCreation: 1,
          baseCurrencyAmount: dto.amount,
          notes: dto.notes ?? null,
          createdAt: new Date(dto.date),
        },
      });

      return tx.salaryAdvance.create({
        data: {
          employeeId: dto.employeeId,
          date: new Date(dto.date),
          amount: dto.amount,
          notes: dto.notes ?? null,
          financialMovementId: fm.id,
        },
        include: { employee: true },
      });
    });
  }

  async findAllPayments() {
    return this.prisma.salaryPayment.findMany({
      where: { deletedAt: null },
      orderBy: { date: 'desc' },
      include: { employee: true },
    });
  }

  async findAllAdvances() {
    return this.prisma.salaryAdvance.findMany({
      where: { deletedAt: null },
      orderBy: { date: 'desc' },
      include: { employee: true },
    });
  }

  async voidPayment(id: string) {
    const p = await this.prisma.salaryPayment.findUnique({ where: { id } });
    if (!p) throw new NotFoundException('Payment not found');
    if (p.deletedAt) throw new BadRequestException('Already voided');
    return this.prisma.salaryPayment.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  async voidAdvance(id: string) {
    const a = await this.prisma.salaryAdvance.findUnique({ where: { id } });
    if (!a) throw new NotFoundException('Advance not found');
    if (a.deletedAt) throw new BadRequestException('Already voided');
    return this.prisma.salaryAdvance.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
