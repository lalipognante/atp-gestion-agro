import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class LotsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    fieldId: string;
    surfaceHa: number;
    location?: string;
  }) {
    return this.prisma.lot.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.lot.findMany({
      include: {
        field: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async fieldExists(fieldId: string) {
    return this.prisma.field.findUnique({
      where: { id: fieldId },
    });
  }
}
