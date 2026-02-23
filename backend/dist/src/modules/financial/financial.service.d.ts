import { FinancialRepository } from './financial.repository';
export declare class FinancialService {
    private readonly repo;
    constructor(repo: FinancialRepository);
    findAll(): Promise<{
        id: string;
        createdAt: Date;
        direction: import(".prisma/client").$Enums.FinancialDirection;
        category: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        currency: import(".prisma/client").$Enums.Currency;
        exchangeRateAtCreation: import("@prisma/client/runtime/library").Decimal;
        baseCurrencyAmount: import("@prisma/client/runtime/library").Decimal;
        relatedType: string | null;
        relatedId: string | null;
    }[]>;
}
