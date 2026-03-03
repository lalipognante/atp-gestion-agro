import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateThirdPartyWorkDto } from './dto/create-third-party-work.dto';
import {
  Currency,
  FinancialDirection,
  PaymentMethod,
  ProviderType,
  ThirdPartyWorkStatus,
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
          providerType: dto.providerType ?? ProviderType.EXTERNO,
          status: dto.status ?? ThirdPartyWorkStatus.PENDING,
          financialMovementId: fm?.id ?? null,
        },
        include: { lot: { include: { field: true } } },
      });
    });
  }

  async findAll(lotId?: string, providerType?: ProviderType) {
    return this.prisma.thirdPartyWork.findMany({
      where: {
        deletedAt: null,
        ...(lotId ? { lotId } : {}),
        ...(providerType ? { providerType } : {}),
      },
      orderBy: { date: 'desc' },
      include: { lot: { include: { field: true } } },
    });
  }

  async markPaid(id: string) {
    const work = await this.prisma.thirdPartyWork.findUnique({ where: { id } });
    if (!work) throw new NotFoundException('ThirdPartyWork not found');
    if (work.deletedAt) throw new BadRequestException('Already voided');
    if (work.status === ThirdPartyWorkStatus.PAID) throw new BadRequestException('Already paid');

    // Create financial movement for payment
    let fm: { id: string } | null = null;
    if (work.paymentMethod !== PaymentMethod.QUINTALES && work.amount) {
      fm = await this.prisma.financialMovement.create({
        data: {
          direction: FinancialDirection.EXPENSE,
          category: 'THIRD_PARTY_WORK',
          amount: Number(work.amount),
          currency: work.currency ?? Currency.ARS,
          exchangeRateAtCreation: 1,
          baseCurrencyAmount: Number(work.amount),
          paymentMethod: work.paymentMethod,
          counterparty: work.contractor,
          notes: `Pago labor: ${work.workType}`,
        },
      });
    }

    return this.prisma.thirdPartyWork.update({
      where: { id },
      data: {
        status: ThirdPartyWorkStatus.PAID,
        ...(fm ? { financialMovementId: fm.id } : {}),
      },
      include: { lot: { include: { field: true } } },
    });
  }

  async void(id: string) {
    const work = await this.prisma.thirdPartyWork.findUnique({ where: { id } });
    if (!work) throw new NotFoundException('ThirdPartyWork not found');
    if (work.deletedAt) throw new BadRequestException('Already voided');
    return this.prisma.thirdPartyWork.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
