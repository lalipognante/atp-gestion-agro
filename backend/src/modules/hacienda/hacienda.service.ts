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
    const isSalePurchase =
      dto.type === LivestockMovementType.SALE ||
      dto.type === LivestockMovementType.PURCHASE;

    // ── Nuevo flujo: SALE / PURCHASE con items por categoría ──
    if (isSalePurchase && dto.items?.length) {
      const totalAnimals = dto.items.reduce((s, i) => s + i.quantity, 0);
      const avgWeightKg = dto.avgWeightKg ?? 0;
      const pricePerKg = dto.pricePerKg ?? 0;
      const totalWeightKg = totalAnimals * avgWeightKg;
      const totalAmount = dto.totalAmount ?? totalWeightKg * pricePerKg;

      return this.prisma.$transaction(async (tx) => {
        const movement = await tx.livestockMovement.create({
          data: {
            date: new Date(dto.date),
            category: LivestockCategory.VACAS, // dummy requerido por schema legacy
            type: dto.type,
            quantity: totalAnimals,
            avgWeightKg: dto.avgWeightKg ?? null,
            pricePerKg: dto.pricePerKg ?? null,
            totalWeightKg: totalWeightKg > 0 ? totalWeightKg : null,
            totalAmount: totalAmount > 0 ? totalAmount : null,
            notes: dto.notes ?? null,
            items: {
              create: (dto.items ?? []).map((i) => ({
                category: i.category,
                quantity: i.quantity,
              })),
            },
          },
          include: { items: true },
        });

        if (totalAmount > 0) {
          await tx.financialMovement.create({
            data: {
              direction:
                dto.type === LivestockMovementType.SALE
                  ? FinancialDirection.INCOME
                  : FinancialDirection.EXPENSE,
              category:
                dto.type === LivestockMovementType.SALE
                  ? 'STOCK_SALE'
                  : 'STOCK_PURCHASE',
              amount: totalAmount,
              currency: Currency.ARS,
              exchangeRateAtCreation: 1,
              baseCurrencyAmount: totalAmount,
              notes: dto.notes ?? null,
            },
          });
        }

        return movement;
      });
    }

    // ── Legacy: INCOME / DEATH / TRANSFER / ADJUSTMENT ────────
    const categoryV2 = dto.categoryV2 ?? null;
    const category: LivestockCategory = categoryV2
      ? V2_TO_V1[categoryV2]
      : (dto.category ?? LivestockCategory.VACAS);
    const qty = dto.quantity ?? 0;

    // Legacy SALE with totalPrice (para datos anteriores a este rediseño)
    if (dto.type === LivestockMovementType.SALE && dto.totalPrice != null) {
      return this.prisma.$transaction(async (tx) => {
        const movement = await tx.livestockMovement.create({
          data: {
            date: new Date(dto.date),
            category,
            categoryV2,
            type: dto.type,
            quantity: qty,
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
        quantity: qty,
        totalPrice: dto.totalPrice ?? null,
        notes: dto.notes ?? null,
      },
    });
  }

  async getDashboard() {
    const movements = await this.prisma.livestockMovement.findMany({
      where: { deletedAt: null },
      orderBy: { date: 'desc' },
      include: { items: true },
    });

    let totalHeads = 0;
    const byCategory: Record<string, number> = {};
    let totalCattleSaleIncome = 0;

    for (const m of movements) {
      const qty = m.quantity;
      let delta = 0;
      if (
        m.type === LivestockMovementType.INCOME ||
        m.type === LivestockMovementType.PURCHASE ||
        m.type === LivestockMovementType.ADJUSTMENT
      ) {
        delta = +qty;
      } else if (
        m.type === LivestockMovementType.SALE ||
        m.type === LivestockMovementType.DEATH ||
        m.type === LivestockMovementType.TRANSFER
      ) {
        delta = -qty;
      }

      totalHeads += delta;

      // Distribute by items if available, otherwise use legacy category field
      if (m.items.length > 0 && qty > 0) {
        for (const item of m.items) {
          byCategory[item.category] = (byCategory[item.category] ?? 0) + delta * (item.quantity / qty);
        }
      } else {
        const cat: string = m.categoryV2 ?? m.category;
        byCategory[cat] = (byCategory[cat] ?? 0) + delta;
      }

      // Income from sales (new totalAmount or legacy totalPrice)
      if (m.type === LivestockMovementType.SALE) {
        const saleAmount = m.totalAmount != null ? Number(m.totalAmount) : (m.totalPrice != null ? Number(m.totalPrice) : 0);
        totalCattleSaleIncome += saleAmount;
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
      include: { items: true },
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
