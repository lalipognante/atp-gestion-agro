import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ObligationsRepository } from './obligations.repository';
import { CreateObligationDto } from './dto/create-obligation.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { Currency, FinancialDirection, ObligationStatus } from '@prisma/client';

@Injectable()
export class ObligationsService {
  constructor(
    private readonly repo: ObligationsRepository,
    private readonly prisma: PrismaService,
  ) {}

  async create(dto: CreateObligationDto) {
    return this.repo.create(dto);
  }

  async findAll() {
    return this.repo.findAll();
  }

  async pay(id: string) {
    const obligation = await this.repo.findById(id);

    if (!obligation) {
      throw new NotFoundException('Obligation not found');
    }

    if (obligation.status === ObligationStatus.PAID) {
      throw new BadRequestException('Obligation is already paid');
    }

    return this.prisma.$transaction(async (tx) => {
      const financialMovement = await tx.financialMovement.create({
        data: {
          direction: FinancialDirection.EXPENSE,
          category: 'OBLIGATION_' + obligation.type,
          amount: obligation.amount,
          currency: Currency.ARS,
          exchangeRateAtCreation: 1,
          baseCurrencyAmount: obligation.amount,
        },
      });

      return tx.obligation.update({
        where: { id },
        data: {
          status: ObligationStatus.PAID,
          financialMovementId: financialMovement.id,
        },
      });
    });
  }
}
