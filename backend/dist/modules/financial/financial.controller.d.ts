import { FinancialService } from './financial.service';
export declare class FinancialController {
    private readonly service;
    constructor(service: FinancialService);
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
    getBalance(campaignId: string): Promise<{
        income: number;
        expense: number;
        balance: number;
    }>;
}
