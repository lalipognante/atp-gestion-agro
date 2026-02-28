import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly service;
    constructor(service: DashboardService);
    getSummary(): Promise<{
        stock: {
            totalNetStock: number;
        };
        livestock: {
            totalHeads: number;
        };
        financial: {
            monthlyIncome: number;
            monthlyExpense: number;
            monthlyResult: number;
        };
        obligations: {
            urgent: {
                id: string;
                createdAt: Date;
                type: import(".prisma/client").$Enums.ObligationType;
                amount: import("@prisma/client/runtime/library").Decimal;
                concept: string;
                dueDate: Date;
                status: import(".prisma/client").$Enums.ObligationStatus;
                financialMovementId: string | null;
            }[];
            upcoming: {
                id: string;
                createdAt: Date;
                type: import(".prisma/client").$Enums.ObligationType;
                amount: import("@prisma/client/runtime/library").Decimal;
                concept: string;
                dueDate: Date;
                status: import(".prisma/client").$Enums.ObligationStatus;
                financialMovementId: string | null;
            }[];
        };
        lastMovements: ({
            id: string;
            source: "financial";
            date: Date;
            description: string;
            direction: import(".prisma/client").$Enums.FinancialDirection;
            amount: number;
            currency: import(".prisma/client").$Enums.Currency;
        } | {
            id: string;
            source: "livestock";
            date: Date;
            description: string;
            quantity: number;
            totalPrice: number | null;
        } | {
            id: string;
            source: "stock";
            date: Date;
            description: string;
            quantity: number;
            unit: string;
        })[];
    }>;
}
