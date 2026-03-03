import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateHealthRecordDto } from './dto/create-health-record.dto';
import { Currency, FinancialDirection } from '@prisma/client';

@Injectable()
export class HealthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateHealthRecordDto) {
    // Determine effective cost
    const effectiveCost = dto.totalCost ?? dto.cost ?? null;

    const record = await this.prisma.livestockHealthRecord.create({
      data: {
        date: new Date(dto.date),
        livestockType: dto.livestockType,
        treatmentType: dto.treatmentType,
        quantity: dto.quantity,
        appliesToAll: dto.appliesToAll ?? false,
        totalCost: dto.totalCost ?? null,
        costPerHead: dto.costPerHead ?? null,
        cost: effectiveCost,
        notes: dto.notes ?? null,
      },
    });

    // Auto-create financial movement if there's a cost
    if (effectiveCost && Number(effectiveCost) > 0) {
      await this.prisma.financialMovement.create({
        data: {
          direction: FinancialDirection.EXPENSE,
          category: 'SANIDAD',
          amount: Number(effectiveCost),
          currency: Currency.ARS,
          exchangeRateAtCreation: 1,
          baseCurrencyAmount: Number(effectiveCost),
          notes: dto.notes ?? null,
        },
      });
    }

    return record;
  }

  async findAll() {
    return this.prisma.livestockHealthRecord.findMany({
      where: { deletedAt: null },
      orderBy: { date: 'desc' },
    });
  }

  async void(id: string) {
    const record = await this.prisma.livestockHealthRecord.findUnique({ where: { id } });
    if (!record) throw new NotFoundException('Health record not found');
    if (record.deletedAt) throw new BadRequestException('Already voided');
    return this.prisma.livestockHealthRecord.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
