import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateHaciendaMovementDto } from './dto/create-hacienda-movement.dto';
import { LivestockCategory } from '@prisma/client';

@Injectable()
export class HaciendaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateHaciendaMovementDto) {
    return this.prisma.livestockMovement.create({
      data: {
        date: new Date(dto.date),
        category: dto.category ?? LivestockCategory.VACAS,
        type: dto.type,
        quantity: dto.quantity ?? 0,
        totalPrice: dto.totalPrice ?? null,
        notes: dto.notes ?? null,
      },
    });
  }

  async findAll() {
    return this.prisma.livestockMovement.findMany({
      where: { deletedAt: null },
      orderBy: { date: 'desc' },
    });
  }
}
