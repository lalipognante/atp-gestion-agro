import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { FieldsModule } from './modules/fields/fields.module';
import { LotsModule } from './modules/lots/lots.module';
import { StockModule } from './modules/stock/stock.module';
import { FinancialModule } from './modules/financial/financial.module';
import { ObligationsModule } from './modules/obligations/obligations.module';
import { HaciendaModule } from './modules/hacienda/hacienda.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    FieldsModule,
    LotsModule,
    StockModule,
    FinancialModule,
    ObligationsModule,
    HaciendaModule,
    DashboardModule,
  ],
})
export class AppModule {}
