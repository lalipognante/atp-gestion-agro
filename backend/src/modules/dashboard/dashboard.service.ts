import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  FinancialDirection,
  LivestockMovementType,
  ObligationStatus,
  StockMovementType,
} from '@prisma/client';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const in7Days = new Date(today);
    in7Days.setDate(in7Days.getDate() + 7);
    const in30Days = new Date(today);
    in30Days.setDate(in30Days.getDate() + 30);

    const [
      allStock,
      allLivestock,
      monthlyFinancial,
      urgentObligations,
      upcomingObligations,
      recentFinancial,
      recentLivestock,
      recentStock,
    ] = await Promise.all([
      this.prisma.stockMovement.findMany(),
      this.prisma.livestockMovement.findMany(),
      this.prisma.financialMovement.findMany({
        where: { createdAt: { gte: startOfMonth, lt: startOfNextMonth } },
      }),
      this.prisma.obligation.findMany({
        where: {
          status: ObligationStatus.PENDING,
          dueDate: { lte: in7Days },
        },
        orderBy: { dueDate: 'asc' },
      }),
      this.prisma.obligation.findMany({
        where: {
          status: ObligationStatus.PENDING,
          dueDate: { gt: in7Days, lte: in30Days },
        },
        orderBy: { dueDate: 'asc' },
      }),
      this.prisma.financialMovement.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      this.prisma.livestockMovement.findMany({
        orderBy: { date: 'desc' },
        take: 10,
      }),
      this.prisma.stockMovement.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
    ]);

    // ── Stock: net quantity across all movements ──────────────────────────
    let totalNetStock = 0;
    for (const m of allStock) {
      const qty = Number(m.quantity);
      switch (m.movementType) {
        case StockMovementType.HARVEST:
        case StockMovementType.PURCHASE:
          totalNetStock += qty;
          break;
        case StockMovementType.SALE:
        case StockMovementType.INTERNAL_CONSUMPTION:
          totalNetStock -= qty;
          break;
        case StockMovementType.ADJUSTMENT:
          totalNetStock += qty;
          break;
        // TRANSFER does not change total stock, skip
      }
    }

    // ── Livestock: total heads ────────────────────────────────────────────
    let totalHeads = 0;
    for (const m of allLivestock) {
      const qty = m.quantity;
      switch (m.type) {
        case LivestockMovementType.INCOME:
          totalHeads += qty;
          break;
        case LivestockMovementType.SALE:
        case LivestockMovementType.DEATH:
        case LivestockMovementType.TRANSFER:
          totalHeads -= qty;
          break;
        case LivestockMovementType.ADJUSTMENT:
          totalHeads += qty;
          break;
      }
    }

    // ── Monthly financial summary ─────────────────────────────────────────
    let monthlyIncome = 0;
    let monthlyExpense = 0;
    for (const m of monthlyFinancial) {
      const amount = Number(m.baseCurrencyAmount);
      if (m.direction === FinancialDirection.INCOME) {
        monthlyIncome += amount;
      } else {
        monthlyExpense += amount;
      }
    }

    // ── Last 10 combined movements ────────────────────────────────────────
    const combined = [
      ...recentFinancial.map((m) => ({
        id: m.id,
        source: 'financial' as const,
        date: m.createdAt,
        description: m.category ?? m.direction,
        direction: m.direction,
        amount: Number(m.baseCurrencyAmount),
        currency: m.currency,
      })),
      ...recentLivestock.map((m) => ({
        id: m.id,
        source: 'livestock' as const,
        date: m.date,
        description: `${m.type} · ${m.category}`,
        quantity: m.quantity,
        totalPrice: m.totalPrice != null ? Number(m.totalPrice) : null,
      })),
      ...recentStock.map((m) => ({
        id: m.id,
        source: 'stock' as const,
        date: m.createdAt,
        description: `${m.movementType} · ${m.product}`,
        quantity: Number(m.quantity),
        unit: m.unit,
      })),
    ];

    combined.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return {
      stock: {
        totalNetStock,
      },
      livestock: {
        totalHeads,
      },
      financial: {
        monthlyIncome,
        monthlyExpense,
        monthlyResult: monthlyIncome - monthlyExpense,
      },
      obligations: {
        urgent: urgentObligations,
        upcoming: upcomingObligations,
      },
      lastMovements: combined.slice(0, 10),
    };
  }
}
