import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateThirdPartyWorkDto } from './dto/create-third-party-work.dto';
import {
  Currency,
  FinancialDirection,
  PaymentMethod,
} from '@prisma/client';

@Injectable()
export class ThirdPartyWorksRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateThirdPartyWorkDto) {
    if (dto.paymentMethod === PaymentMethod.QUINTALES) {
      if (!dto.quintales) {
        throw new BadRequestException('quintales is required when paymentMethod is QUINTALES');
      }
    } else {
      if (!dto.amount) {
        throw new BadRequestException('amount is required when paymentMethod is not QUINTALES');
      }
    }

    const lot = await this.prisma.lot.findUnique({ where: { id: dto.lotId } });
    if (!lot) {
      throw new BadRequestException('Lot not found');
    }

    return this.prisma.$transaction(async (tx) => {
      const notesArr: string[] = [];
      if (dto.notes) notesArr.push(dto.notes);
      if (dto.paymentMethod === PaymentMethod.QUINTALES && dto.quintales) {
        notesArr.push(
          `Pago en quintales: ${dto.quintales}${dto.grainType ? ` (${dto.grainType})` : ''}`,
        );
      }
      const combinedNotes = notesArr.length > 0 ? notesArr.join(' | ') : null;

      let fm: { id: string } | null = null;
      if (dto.paymentMethod !== PaymentMethod.QUINTALES && dto.amount) {
        fm = await tx.financialMovement.create({
          data: {
            direction: FinancialDirection.EXPENSE,
            category: 'THIRD_PARTY_WORK',
            amount: dto.amount,
            currency: dto.currency ?? Currency.ARS,
            exchangeRateAtCreation: 1,
            baseCurrencyAmount: dto.amount,
            paymentMethod: dto.paymentMethod,
            counterparty: dto.contractor,
            reference: dto.reference ?? null,
            notes: combinedNotes,
            createdAt: new Date(dto.date),
          },
        });
      }

      return tx.thirdPartyWork.create({
        data: {
          date: new Date(dto.date),
          workType: dto.workType,
          lotId: dto.lotId,
          contractor: dto.contractor,
          paymentMethod: dto.paymentMethod,
          amount: dto.amount ?? null,
          currency: dto.currency ?? null,
          quintales: dto.quintales ?? null,
          grainType: dto.grainType ?? null,
          reference: dto.reference ?? null,
          notes: combinedNotes,
          financialMovementId: fm?.id ?? null,
        },
        include: { lot: { include: { field: true } } },
      });
    });
  }

  async findAll(lotId?: string) {
    return this.prisma.thirdPartyWork.findMany({
      where: lotId ? { lotId } : undefined,
      orderBy: { date: 'desc' },
      include: { lot: { include: { field: true } } },
    });
  }
}
