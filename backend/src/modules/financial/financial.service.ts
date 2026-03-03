import { Injectable } from '@nestjs/common';
import { FinancialRepository } from './financial.repository';
import { PrismaService } from '../../prisma/prisma.service';
import { FinancialDirection } from '@prisma/client';
import { CreateFinancialMovementDto } from './dto/create-financial-movement.dto';

@Injectable()
export class FinancialService {
  constructor(
    private readonly repo: FinancialRepository,
    private readonly prisma: PrismaService,
  ) {}

  async create(dto: CreateFinancialMovementDto) {
    return this.repo.create(dto);
  }

  async findAll() {
    return this.repo.findAll();
  }

  async getBalanceByCampaign(campaignId: string) {
    const movements = await this.prisma.financialMovement.findMany({
      where: { campaignId },
    });

    let income = 0;
    let expense = 0;

    for (const m of movements) {
      if (m.direction === FinancialDirection.INCOME) {
        income += Number(m.amount);
      } else {
        expense += Number(m.amount);
      }
    }

    return { income, expense, balance: income - expense };
  }
}
