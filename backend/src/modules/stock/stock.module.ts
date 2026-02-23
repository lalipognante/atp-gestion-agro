import { Module } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockRepository } from './stock.repository';
import { StockController } from './stock.controller';

@Module({
  controllers: [StockController],
  providers: [StockService, StockRepository],
})
export class StockModule {}
