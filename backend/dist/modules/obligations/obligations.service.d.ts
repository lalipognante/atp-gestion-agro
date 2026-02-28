import { ObligationsRepository } from './obligations.repository';
import { CreateObligationDto } from './dto/create-obligation.dto';
import { PrismaService } from '../../prisma/prisma.service';
export declare class ObligationsService {
    private readonly repo;
    private readonly prisma;
    constructor(repo: ObligationsRepository, prisma: PrismaService);
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
