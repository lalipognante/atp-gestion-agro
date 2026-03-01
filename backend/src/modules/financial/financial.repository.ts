import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateFinancialMovementDto } from './dto/create-financial-movement.dto';
import { Currency } from '@prisma/client';

@Injectable()
export class FinancialRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateFinancialMovementDto) {
    const amount = dto.amount;
    // ARS = 1:1, USD kept as-is in baseCurrencyAmount for now
    const exchangeRate = dto.currency === Currency.USD ? 1 : 1;

    return this.prisma.financialMovement.create({
      data: {
        direction: dto.direction,
        category: dto.category ?? null,
        amount,
        currency: dto.currency,
        exchangeRateAtCreation: exchangeRate,
        baseCurrencyAmount: amount,
        ...(dto.campaignId ? { campaignId: dto.campaignId } : {}),
        ...(dto.stockMovementId ? { stockMovementId: dto.stockMovementId } : {}),
        ...(dto.date ? { createdAt: new Date(dto.date) } : {}),
      },
    });
  }

  async findAll() {
    return this.prisma.financialMovement.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}
