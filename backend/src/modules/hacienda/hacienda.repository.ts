import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateHaciendaMovementDto } from './dto/create-hacienda-movement.dto';

@Injectable()
export class HaciendaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateHaciendaMovementDto) {
    return this.prisma.livestockMovement.create({
      data: {
        date: new Date(dto.date),
        category: dto.category,
        type: dto.type,
        quantity: dto.quantity,
        totalPrice: dto.totalPrice ?? null,
        notes: dto.notes ?? null,
      },
    });
  }

  async findAll() {
    return this.prisma.livestockMovement.findMany({
      orderBy: { date: 'desc' },
    });
  }
}
