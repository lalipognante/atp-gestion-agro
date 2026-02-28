import { Injectable } from '@nestjs/common';
import { HaciendaRepository } from './hacienda.repository';
import { CreateHaciendaMovementDto } from './dto/create-hacienda-movement.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { Currency, FinancialDirection, LivestockMovementType } from '@prisma/client';

@Injectable()
export class HaciendaService {
  constructor(
    private readonly repo: HaciendaRepository,
    private readonly prisma: PrismaService,
  ) {}

  async create(dto: CreateHaciendaMovementDto) {
    const isSaleWithPrice =
      dto.type === LivestockMovementType.SALE && dto.totalPrice != null;

    if (isSaleWithPrice) {
      return this.prisma.$transaction(async (tx) => {
        const movement = await tx.livestockMovement.create({
          data: {
            date: new Date(dto.date),
            category: dto.category,
            type: dto.type,
            quantity: dto.quantity,
            totalPrice: dto.totalPrice,
            notes: dto.notes ?? null,
          },
        });

        await tx.financialMovement.create({
          data: {
            direction: FinancialDirection.INCOME,
            category: 'CATTLE_SALE',
            amount: dto.totalPrice!,
            currency: Currency.ARS,
            exchangeRateAtCreation: 1,
            baseCurrencyAmount: dto.totalPrice!,
          },
        });

        return movement;
      });
    }

    return this.repo.create(dto);
  }

  async getDashboard() {
    const movements = await this.repo.findAll();

    let totalHeads = 0;
    const byCategory: Record<string, number> = {};
    let totalCattleSaleIncome = 0;

    for (const m of movements) {
      const qty = m.quantity;
      const cat = m.category;

      if (m.type === LivestockMovementType.INCOME) {
        totalHeads += qty;
        byCategory[cat] = (byCategory[cat] ?? 0) + qty;
      } else if (
        m.type === LivestockMovementType.SALE ||
        m.type === LivestockMovementType.DEATH ||
        m.type === LivestockMovementType.TRANSFER
      ) {
        totalHeads -= qty;
        byCategory[cat] = (byCategory[cat] ?? 0) - qty;
      } else if (m.type === LivestockMovementType.ADJUSTMENT) {
        totalHeads += qty;
        byCategory[cat] = (byCategory[cat] ?? 0) + qty;
      }

      if (m.type === LivestockMovementType.SALE && m.totalPrice != null) {
        totalCattleSaleIncome += Number(m.totalPrice);
      }
    }

    return {
      totalHeads,
      byCategory,
      totalCattleSaleIncome,
    };
  }
}
