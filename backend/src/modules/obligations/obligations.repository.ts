import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateObligationDto } from './dto/create-obligation.dto';
import { ObligationStatus } from '@prisma/client';

@Injectable()
export class ObligationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateObligationDto) {
    return this.prisma.obligation.create({
      data: {
        concept: dto.concept,
        amount: dto.amount,
        dueDate: new Date(dto.dueDate),
        type: dto.type,
        status: ObligationStatus.PENDING,
      },
    });
  }

  async findAll() {
    return this.prisma.obligation.findMany({
      orderBy: { dueDate: 'asc' },
    });
  }

  async findById(id: string) {
    return this.prisma.obligation.findUnique({ where: { id } });
  }
}
