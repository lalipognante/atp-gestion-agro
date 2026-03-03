import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';

@Injectable()
export class EmployeesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateEmployeeDto) {
    return this.prisma.employee.create({
      data: { name: dto.name },
    });
  }

  async findAll() {
    return this.prisma.employee.findMany({
      orderBy: { name: 'asc' },
    });
  }
}
