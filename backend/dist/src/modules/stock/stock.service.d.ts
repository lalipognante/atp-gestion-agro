import { StockRepository } from './stock.repository';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';
import { PrismaService } from '../../prisma/prisma.service';
export declare class StockService {
    private readonly stockRepository;
    private readonly prisma;
    constructor(stockRepository: StockRepository, prisma: PrismaService);
    create(dto: CreateStockMovementDto): Promise<{
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
    getSummary(campaignId: string): Promise<{
        product: null;
        harvest: number;
        purchase: number;
        sale: number;
        internalConsumption: number;
        adjustment: number;
        netStock: number;
    } | {
        product: string;
        harvest: number;
        purchase: number;
        sale: number;
        internalConsumption: number;
        adjustment: number;
        netStock: number;
    }>;
}
