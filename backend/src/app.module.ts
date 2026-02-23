import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { FieldsModule } from './modules/fields/fields.module';
import { LotsModule } from './modules/lots/lots.module';
import { StockModule } from './modules/stock/stock.module';
import { FinancialModule } from './modules/financial/financial.module';
import { LoansModule } from './modules/loans/loans.module';
import { ObligationsModule } from './modules/obligations/obligations.module';
import { PricingModule } from './modules/pricing/pricing.module';
import { CampaignsModule } from './modules/campaigns/campaigns.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    FieldsModule,
    CampaignsModule,
    LotsModule,
    StockModule,
    FinancialModule,
    LoansModule,
    ObligationsModule,
    PricingModule,
  ],
})
export class AppModule {}