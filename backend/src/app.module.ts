import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { FieldsModule } from './modules/fields/fields.module';
import { LotsModule } from './modules/lots/lots.module';
import { StockModule } from './modules/stock/stock.module';
import { FinancialModule } from './modules/financial/financial.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    FieldsModule,
    LotsModule,
    StockModule,
    FinancialModule,
  ],
})
export class AppModule {}
