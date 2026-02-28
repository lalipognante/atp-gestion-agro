import { StockMovementType } from '@prisma/client';
export declare class CreateStockMovementDto {
    product: string;
    movementType: StockMovementType;
    quantity: number;
    unit: string;
    campaignId: string;
    pricePerUnit?: number;
}
