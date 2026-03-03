import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { PayrollRepository } from './payroll.repository';
import { PayrollService } from './payroll.service';
import { PayrollController } from './payroll.controller';

@Module({
  imports: [PrismaModule],
  controllers: [PayrollController],
  providers: [PayrollRepository, PayrollService],
})
export class PayrollModule {}
