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
    // Validate campaign if provided
    if (dto.campaignId) {
      const campaign = await this.stockRepository.campaignExists(dto.campaignId);
      if (!campaign) throw new NotFoundException('Campaign not found');
    }

    const qty = Number(dto.quantity);

    // For SALE/INTERNAL_CONSUMPTION with campaign: validate stock
    if (dto.campaignId && (dto.movementType === 'SALE' || dto.movementType === 'INTERNAL_CONSUMPTION')) {
      const summary = await this.getSummary(dto.campaignId);
      if (qty > summary.netStock) {
        throw new BadRequestException(
          `Insufficient stock. Current stock: ${summary.netStock}`,
        );
      }
    }

    const stockMovement = await this.stockRepository.create(dto);

    // Auto-create financial movement for SALE or PURCHASE
    if (dto.movementType === 'SALE' || dto.movementType === 'PURCHASE') {
      if (!dto.pricePerUnit) {
        throw new BadRequestException('pricePerUnit required for SALE or PURCHASE');
      }
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
          ...(dto.campaignId ? { campaignId: dto.campaignId } : {}),
        },
      });
    }

    return stockMovement;
  }

  async findAll() {
    return this.stockRepository.findAll();
  }

  async getSummary(campaignId: string) {
    const movements = await this.stockRepository.findByCampaign(campaignId);

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
}
