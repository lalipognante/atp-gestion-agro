import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateFarmWorkDto } from './dto/create-farm-work.dto';
import { Currency, FinancialDirection } from '@prisma/client';

@Injectable()
export class FarmWorksRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateFarmWorkDto) {
    const lot = await this.prisma.lot.findUnique({ where: { id: dto.lotId } });
    if (!lot) throw new BadRequestException('Lot not found');

    return this.prisma.$transaction(async (tx) => {
      let fmId: string | null = null;

      if (dto.cost && dto.cost > 0) {
        const fm = await tx.financialMovement.create({
          data: {
            direction: FinancialDirection.EXPENSE,
            category: 'LABOR_INTERNA',
            amount: dto.cost,
            currency: dto.currency ?? Currency.ARS,
            exchangeRateAtCreation: 1,
            baseCurrencyAmount: dto.cost,
            notes: dto.notes ?? null,
            createdAt: new Date(dto.date),
          },
        });
        fmId = fm.id;
      }

      return tx.farmWork.create({
        data: {
          date: new Date(dto.date),
          workType: dto.workType,
          lotId: dto.lotId,
          responsible: dto.responsible ?? null,
          cost: dto.cost ?? null,
          currency: dto.currency ?? null,
          notes: dto.notes ?? null,
          financialMovementId: fmId,
        },
        include: { lot: { include: { field: true } } },
      });
    });
  }

  async findAll(lotId?: string) {
    return this.prisma.farmWork.findMany({
      where: {
        deletedAt: null,
        ...(lotId ? { lotId } : {}),
      },
      orderBy: { date: 'desc' },
      include: { lot: { include: { field: true } } },
    });
  }

  async void(id: string) {
    const work = await this.prisma.farmWork.findUnique({ where: { id } });
    if (!work) throw new NotFoundException('FarmWork not found');
    if (work.deletedAt) throw new BadRequestException('Already voided');

    return this.prisma.$transaction(async (tx) => {
      if (work.financialMovementId) {
        await tx.financialMovement.update({
          where: { id: work.financialMovementId },
          data: { deletedAt: new Date() },
        });
      }
      return tx.farmWork.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
    });
  }
}
