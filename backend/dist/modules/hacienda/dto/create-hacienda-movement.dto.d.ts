import { LivestockMovementType, LivestockCategory } from '@prisma/client';
export declare class CreateHaciendaMovementDto {
    date: string;
    category: LivestockCategory;
    type: LivestockMovementType;
    quantity: number;
    totalPrice?: number;
    notes?: string;
}
