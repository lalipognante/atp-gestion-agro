import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class StockRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any) {
    const { campaignId, pricePerUnit, ...rest } = data;

    return this.prisma.stockMovement.create({
      data: {
        ...rest,
        campaign: {
          connect: { id: campaignId },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.stockMovement.findMany({
      include: {
        campaign: {
          include: {
            lot: {
              include: {
                field: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByCampaign(campaignId: string) {
    return this.prisma.stockMovement.findMany({
      where: {
        campaign: {
          id: campaignId,
        },
      },
    });
  }

  async campaignExists(campaignId: string) {
    return this.prisma.campaign.findUnique({
      where: { id: campaignId },
    });
  }
}
