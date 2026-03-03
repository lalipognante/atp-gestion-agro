import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { StockRepository } from './stock.repository';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { FinancialDirection, Currency } from '@prisma/client';

@Injectable()
export class StockService {
  constructor(
    private readonly stockRepository: StockRepository,
    private readonly prisma: PrismaService,
  ) {}

  async create(dto: CreateStockMovementDto) {
    if (dto.campaignId) {
      const campaign = await this.stockRepository.campaignExists(dto.campaignId);
      if (!campaign) throw new NotFoundException('Campaign not found');
    }

    const qty = Number(dto.quantity);

    if (dto.campaignId && (dto.movementType === 'SALE' || dto.movementType === 'INTERNAL_CONSUMPTION')) {
      const summary = await this.getSummary(dto.campaignId);
      if (qty > summary.netStock) {
        throw new BadRequestException(
          `Insufficient stock. Current stock: ${summary.netStock}`,
        );
      }
    }

    const stockMovement = await this.stockRepository.create(dto);

    // Auto-create financial movement for SALE or PURCHASE only when pricePerUnit is provided
    if (
      (dto.movementType === 'SALE' || dto.movementType === 'PURCHASE') &&
      dto.pricePerUnit != null
    ) {
      const amount = qty * dto.pricePerUnit;
      await this.prisma.financialMovement.create({
        data: {
          direction:
            dto.movementType === 'SALE'
              ? FinancialDirection.INCOME
              : FinancialDirection.EXPENSE,
          category: 'STOCK_' + dto.movementType,
          amount,
          currency: Currency.ARS,
          exchangeRateAtCreation: 1,
          baseCurrencyAmount: amount,
          stockMovementId: stockMovement.id,
          notes: dto.notes ?? null,
          ...(dto.campaignId ? { campaignId: dto.campaignId } : {}),
        },
      });
    }

    return stockMovement;
  }

  async findAll() {
    return this.stockRepository.findAll();
  }

  async getSummary(campaignId?: string) {
    const movements = campaignId
      ? await this.stockRepository.findByCampaign(campaignId)
      : await this.stockRepository.findAllActive();

    if (!movements.length) {
      return { product: null, harvest: 0, purchase: 0, sale: 0, internalConsumption: 0, adjustment: 0, netStock: 0 };
    }

    let harvest = 0, purchase = 0, sale = 0, internalConsumption = 0, adjustment = 0;

    for (const m of movements) {
      const qty = Number(m.quantity);
      switch (m.movementType) {
        case 'HARVEST':   harvest += qty; break;
        case 'PURCHASE':  purchase += qty; break;
        case 'SALE':      sale += qty; break;
        case 'INTERNAL_CONSUMPTION': internalConsumption += qty; break;
        case 'ADJUSTMENT': adjustment += qty; break;
      }
    }

    return {
      product: movements[0].product,
      harvest, purchase, sale, internalConsumption, adjustment,
      netStock: harvest + purchase + adjustment - sale - internalConsumption,
    };
  }

  async getNetByProduct() {
    const movements = await this.stockRepository.findAllActive();
    const map: Record<string, { product: string; net: number; unit: string }> = {};

    for (const m of movements) {
      const qty = Number(m.quantity);
      const prod = m.product;
      if (!map[prod]) map[prod] = { product: prod, net: 0, unit: m.unit };
      switch (m.movementType) {
        case 'HARVEST':
        case 'PURCHASE':
          map[prod].net += qty; break;
        case 'SALE':
        case 'INTERNAL_CONSUMPTION':
          map[prod].net -= qty; break;
        case 'ADJUSTMENT':
          map[prod].net += qty; break;
      }
    }

    return Object.values(map);
  }

  async void(id: string) {
    const movement = await this.prisma.stockMovement.findUnique({ where: { id } });
    if (!movement) throw new NotFoundException('Stock movement not found');
    if (movement.deletedAt) throw new BadRequestException('Already voided');
    return this.prisma.stockMovement.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
