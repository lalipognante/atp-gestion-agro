import { Module } from '@nestjs/common';
import { FinancialRepository } from './financial.repository';
import { FinancialService } from './financial.service';
import { FinancialController } from './financial.controller';

@Module({
  controllers: [FinancialController],
  providers: [FinancialRepository, FinancialService],
})
export class FinancialModule {}
