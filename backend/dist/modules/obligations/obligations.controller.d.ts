import { ObligationsService } from './obligations.service';
import { CreateObligationDto } from './dto/create-obligation.dto';
export declare class ObligationsController {
    private readonly service;
    constructor(service: ObligationsService);
    create(dto: CreateObligationDto): Promise<{
        id: string;
        createdAt: Date;
        type: import(".prisma/client").$Enums.ObligationType;
        amount: import("@prisma/client/runtime/library").Decimal;
        concept: string;
        dueDate: Date;
        status: import(".prisma/client").$Enums.ObligationStatus;
        financialMovementId: string | null;
    }>;
    findAll(): Promise<{
        id: string;
        createdAt: Date;
        type: import(".prisma/client").$Enums.ObligationType;
        amount: import("@prisma/client/runtime/library").Decimal;
        concept: string;
        dueDate: Date;
        status: import(".prisma/client").$Enums.ObligationStatus;
        financialMovementId: string | null;
    }[]>;
    pay(id: string): Promise<{
        id: string;
        createdAt: Date;
        type: import(".prisma/client").$Enums.ObligationType;
        amount: import("@prisma/client/runtime/library").Decimal;
        concept: string;
        dueDate: Date;
        status: import(".prisma/client").$Enums.ObligationStatus;
        financialMovementId: string | null;
    }>;
}
