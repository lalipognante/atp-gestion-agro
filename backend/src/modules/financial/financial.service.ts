import { Injectable } from '@nestjs/common';
import { FinancialRepository } from './financial.repository';
import { PrismaService } from '../../prisma/prisma.service';
import { FinancialDirection } from '@prisma/client';

@Injectable()
export class FinancialService {
  constructor(
    private readonly repo: FinancialRepository,
    private readonly prisma: PrismaService,
  ) {}

  async findAll() {
    return this.repo.findAll();
  }

  async getBalanceByCampaign(campaignId: string) {
    const movements = await this.prisma.financialMovement.findMany({
      where: {
        relatedType: 'STOCK_MOVEMENT',
      },
    });

    let income = 0;
    let expense = 0;

    for (const m of movements) {
      if (m.direction === FinancialDirection.INCOME) {
        income += Number(m.amount);
      }

      if (m.direction === FinancialDirection.EXPENSE) {
        expense += Number(m.amount);
      }
    }

    return {
      income,
      expense,
      balance: income - expense,
    };
  }
}
