import { FinancialRepository } from './financial.repository';
import { PrismaService } from '../../prisma/prisma.service';
export declare class FinancialService {
    private readonly repo;
    private readonly prisma;
    constructor(repo: FinancialRepository, prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        createdAt: Date;
        direction: import(".prisma/client").$Enums.FinancialDirection;
        category: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        currency: import(".prisma/client").$Enums.Currency;
        exchangeRateAtCreation: import("@prisma/client/runtime/library").Decimal;
        baseCurrencyAmount: import("@prisma/client/runtime/library").Decimal;
        stockMovementId: string | null;
    }[]>;
    getBalanceByCampaign(campaignId: string): Promise<{
        income: number;
        expense: number;
        balance: number;
    }>;
}
