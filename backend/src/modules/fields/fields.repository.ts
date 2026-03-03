import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { FieldType } from '@prisma/client';

@Injectable()
export class FieldsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: { name: string; type: FieldType }) {
    return this.prisma.field.create({ data });
  }

  async findAll() {
    return this.prisma.field.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findById(id: string) {
    return this.prisma.field.findUnique({ where: { id } });
  }

  async update(id: string, data: { name?: string; type?: FieldType }) {
    return this.prisma.field.update({ where: { id }, data });
  }
}
