import { Injectable } from '@nestjs/common';
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
      orderBy: { date: 'desc' },
      include: { employee: true },
    });
  }

  async findAllAdvances() {
    return this.prisma.salaryAdvance.findMany({
      orderBy: { date: 'desc' },
      include: { employee: true },
    });
  }
}
