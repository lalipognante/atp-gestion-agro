import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { EmployeesRepository } from './employees.repository';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';

@Module({
  imports: [PrismaModule],
  controllers: [EmployeesController],
  providers: [EmployeesRepository, EmployeesService],
  exports: [EmployeesService],
})
export class EmployeesModule {}
