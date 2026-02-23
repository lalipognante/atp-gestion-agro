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
    const campaign = await this.stockRepository.campaignExists(dto.campaignId);

    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    const summary = await this.getSummary(dto.campaignId);
    const currentStock = summary.netStock;
    const qty = Number(dto.quantity);

    if (
      dto.movementType === 'SALE' ||
      dto.movementType === 'INTERNAL_CONSUMPTION'
    ) {
      if (qty > currentStock) {
        throw new BadRequestException(
          `Insufficient stock. Current stock: ${currentStock}`
        );
      }
    }

    // 1️⃣ Crear stock movement
    const stockMovement = await this.stockRepository.create(dto);

    // 2️⃣ Si es venta → crear movimiento financiero
    if (dto.movementType === 'SALE') {
      if (!dto.pricePerUnit) {
        throw new BadRequestException(
          'pricePerUnit required for SALE'
        );
      }

      const amount = qty * dto.pricePerUnit;

      await this.prisma.financialMovement.create({
        data: {
          direction: FinancialDirection.INCOME,
          category: 'STOCK_SALE',
          amount,
          currency: Currency.ARS,
          exchangeRateAtCreation: 1,
          baseCurrencyAmount: amount,
          relatedType: 'STOCK_MOVEMENT',
          relatedId: stockMovement.id,
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
      return {
        product: null,
        harvest: 0,
        purchase: 0,
        sale: 0,
        internalConsumption: 0,
        adjustment: 0,
        netStock: 0,
      };
    }

    let harvest = 0;
    let purchase = 0;
    let sale = 0;
    let internalConsumption = 0;
    let adjustment = 0;

    for (const m of movements) {
      const qty = Number(m.quantity);

      switch (m.movementType) {
        case 'HARVEST':
          harvest += qty;
          break;
        case 'PURCHASE':
          purchase += qty;
          break;
        case 'SALE':
          sale += qty;
          break;
        case 'INTERNAL_CONSUMPTION':
          internalConsumption += qty;
          break;
        case 'ADJUSTMENT':
          adjustment += qty;
          break;
      }
    }

    const netStock =
      harvest +
      purchase +
      adjustment -
      sale -
      internalConsumption;

    return {
      product: movements[0].product,
      harvest,
      purchase,
      sale,
      internalConsumption,
      adjustment,
      netStock,
    };
  }
}
