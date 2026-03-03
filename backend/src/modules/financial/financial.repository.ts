import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateFinancialMovementDto } from './dto/create-financial-movement.dto';
import { Currency } from '@prisma/client';

@Injectable()
export class FinancialRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateFinancialMovementDto) {
    const amount = dto.amount;
    const exchangeRate = dto.currency === Currency.USD ? 1 : 1;

    return this.prisma.financialMovement.create({
      data: {
        direction: dto.direction,
        category: dto.category ?? null,
        amount,
        currency: dto.currency,
        exchangeRateAtCreation: exchangeRate,
        baseCurrencyAmount: amount,
        paymentMethod: dto.paymentMethod ?? null,
        reference: dto.reference ?? null,
        counterparty: dto.counterparty ?? null,
        notes: dto.notes ?? null,
        ...(dto.campaignId ? { campaignId: dto.campaignId } : {}),
        ...(dto.stockMovementId ? { stockMovementId: dto.stockMovementId } : {}),
        createdAt: new Date(dto.date),
      },
    });
  }

  async findAll() {
    return this.prisma.financialMovement.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}
