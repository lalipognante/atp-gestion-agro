import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { FinancialRepository } from './financial.repository';
import { FinancialService } from './financial.service';
import { FinancialController } from './financial.controller';

@Module({
  imports: [PrismaModule],
  controllers: [FinancialController],
  providers: [FinancialRepository, FinancialService],
})
export class FinancialModule {}
