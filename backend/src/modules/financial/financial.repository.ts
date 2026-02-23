import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FinancialRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.financialMovement.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}
