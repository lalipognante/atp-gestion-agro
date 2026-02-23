import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CampaignsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    lotId: string;
    year: number;
    crop: string;
  }) {
    return this.prisma.campaign.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.campaign.findMany({
      include: {
        lot: {
          include: {
            field: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async lotExists(lotId: string) {
    return this.prisma.lot.findUnique({
      where: { id: lotId },
    });
  }
}
