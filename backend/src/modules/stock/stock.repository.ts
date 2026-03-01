import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';

@Injectable()
export class StockRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateStockMovementDto) {
    const { campaignId, lotId, pricePerUnit, date, ...rest } = dto;

    return this.prisma.stockMovement.create({
      data: {
        ...rest,
        ...(campaignId ? { campaign: { connect: { id: campaignId } } } : {}),
        ...(lotId ? { lot: { connect: { id: lotId } } } : {}),
        ...(date ? { createdAt: new Date(date) } : {}),
      },
    });
  }

  async findAll() {
    return this.prisma.stockMovement.findMany({
      include: {
        campaign: {
          include: {
            lot: { include: { field: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByCampaign(campaignId: string) {
    return this.prisma.stockMovement.findMany({
      where: { campaign: { id: campaignId } },
    });
  }

  async campaignExists(campaignId: string) {
    return this.prisma.campaign.findUnique({ where: { id: campaignId } });
  }
}
