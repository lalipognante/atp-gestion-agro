import { PrismaService } from '../../prisma/prisma.service';
export declare class StockRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: any): Promise<{
        id: string;
        createdAt: Date;
        campaignId: string | null;
        product: string;
        movementType: import(".prisma/client").$Enums.StockMovementType;
        quantity: import("@prisma/client/runtime/library").Decimal;
        unit: string;
        lotId: string | null;
    }>;
    findAll(): Promise<({
        campaign: ({
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
            lotId: string;
            crop: string;
        }) | null;
    } & {
        id: string;
        createdAt: Date;
        campaignId: string | null;
        product: string;
        movementType: import(".prisma/client").$Enums.StockMovementType;
        quantity: import("@prisma/client/runtime/library").Decimal;
        unit: string;
        lotId: string | null;
    })[]>;
    findByCampaign(campaignId: string): Promise<{
        id: string;
        createdAt: Date;
        campaignId: string | null;
        product: string;
        movementType: import(".prisma/client").$Enums.StockMovementType;
        quantity: import("@prisma/client/runtime/library").Decimal;
        unit: string;
        lotId: string | null;
    }[]>;
    campaignExists(campaignId: string): Promise<{
        id: string;
        createdAt: Date;
        year: number;
        lotId: string;
        crop: string;
    } | null>;
}
