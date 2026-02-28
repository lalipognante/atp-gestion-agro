import { PrismaService } from '../../prisma/prisma.service';
export declare class LotsRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: {
        fieldId: string;
        surfaceHa: number;
        location?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        surfaceHa: import("@prisma/client/runtime/library").Decimal;
        location: string | null;
        fieldId: string;
    }>;
    findAll(): Promise<({
        field: {
            id: string;
            createdAt: Date;
            name: string;
            type: import(".prisma/client").$Enums.FieldType;
        };
    } & {
        id: string;
        createdAt: Date;
        surfaceHa: import("@prisma/client/runtime/library").Decimal;
        location: string | null;
        fieldId: string;
    })[]>;
    fieldExists(fieldId: string): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        type: import(".prisma/client").$Enums.FieldType;
    } | null>;
}
