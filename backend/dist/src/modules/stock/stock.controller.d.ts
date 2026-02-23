import { StockService } from './stock.service';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';
export declare class StockController {
    private readonly stockService;
    constructor(stockService: StockService);
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
