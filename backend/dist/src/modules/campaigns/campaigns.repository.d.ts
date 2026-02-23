import { PrismaService } from '../../prisma/prisma.service';
export declare class CampaignsRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: {
        lotId: string;
        year: number;
        crop: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        year: number;
        crop: string;
        lotId: string;
    }>;
    findAll(): Promise<({
        lot: {
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
        };
    } & {
        id: string;
        createdAt: Date;
        year: number;
        crop: string;
        lotId: string;
    })[]>;
    lotExists(lotId: string): Promise<{
        id: string;
        createdAt: Date;
        surfaceHa: import("@prisma/client/runtime/library").Decimal;
        location: string | null;
        fieldId: string;
    } | null>;
}
