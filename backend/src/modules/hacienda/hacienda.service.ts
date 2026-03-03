import { Injectable } from '@nestjs/common';
import { HaciendaRepository } from './hacienda.repository';
import { CreateHaciendaMovementDto } from './dto/create-hacienda-movement.dto';
import { PrismaService } from '../../prisma/prisma.service';
import {
  Currency,
  FinancialDirection,
  LivestockMovementType,
  LivestockCategory,
  LivestockCategoryV2,
} from '@prisma/client';

// Map V2 → old enum for backward-compat storage
const V2_TO_V1: Record<LivestockCategoryV2, LivestockCategory> = {
  TERNERO:    LivestockCategory.TERNEROS,
  TERNERA:    LivestockCategory.TERNEROS,
  NOVILLO:    LivestockCategory.NOVILLOS,
  VAQUILLONA: LivestockCategory.NOVILLOS,
  TORO:       LivestockCategory.TOROS,
  VACA:       LivestockCategory.VACAS,
};

@Injectable()
export class HaciendaService {
  constructor(
    private readonly repo: HaciendaRepository,
    private readonly prisma: PrismaService,
  ) {}

  async create(dto: CreateHaciendaMovementDto) {
    // Resolve category: use V2 mapping if provided, fallback to legacy
    const categoryV2 = dto.categoryV2 ?? null;
    const category: LivestockCategory = categoryV2
      ? V2_TO_V1[categoryV2]
      : (dto.category ?? LivestockCategory.VACAS);

    const isSaleWithPrice =
      dto.type === LivestockMovementType.SALE && dto.totalPrice != null;

    if (isSaleWithPrice) {
      return this.prisma.$transaction(async (tx) => {
        const movement = await tx.livestockMovement.create({
          data: {
            date: new Date(dto.date),
            category,
            categoryV2,
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

    return this.prisma.livestockMovement.create({
      data: {
        date: new Date(dto.date),
        category,
        categoryV2,
        type: dto.type,
        quantity: dto.quantity,
        totalPrice: dto.totalPrice ?? null,
        notes: dto.notes ?? null,
      },
    });
  }

  async getDashboard() {
    const movements = await this.prisma.livestockMovement.findMany({
      where: { deletedAt: null },
      orderBy: { date: 'desc' },
    });

    let totalHeads = 0;
    const byCategory: Record<string, number> = {};
    let totalCattleSaleIncome = 0;

    for (const m of movements) {
      const qty = m.quantity;
      // Use V2 label if available
      const cat: string = m.categoryV2 ?? m.category;

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

  async findAll() {
    return this.prisma.livestockMovement.findMany({
      where: { deletedAt: null },
      orderBy: { date: 'desc' },
    });
  }

  async void(id: string) {
    const movement = await this.prisma.livestockMovement.findUnique({ where: { id } });
    if (!movement) throw new Error('Not found');
    if (movement.deletedAt) throw new Error('Already voided');
    return this.prisma.livestockMovement.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
