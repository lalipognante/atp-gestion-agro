import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateHealthRecordDto } from './dto/create-health-record.dto';

@Injectable()
export class HealthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateHealthRecordDto) {
    return this.prisma.livestockHealthRecord.create({
      data: {
        date: new Date(dto.date),
        livestockType: dto.livestockType,
        treatmentType: dto.treatmentType,
        quantity: dto.quantity,
        cost: dto.cost ?? null,
        notes: dto.notes ?? null,
      },
    });
  }

  async findAll() {
    return this.prisma.livestockHealthRecord.findMany({
      orderBy: { date: 'desc' },
    });
  }
}
