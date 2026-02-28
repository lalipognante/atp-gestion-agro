import { HaciendaService } from './hacienda.service';
import { CreateHaciendaMovementDto } from './dto/create-hacienda-movement.dto';
export declare class HaciendaController {
    private readonly service;
    constructor(service: HaciendaService);
    create(dto: CreateHaciendaMovementDto): Promise<{
        id: string;
        createdAt: Date;
        type: import(".prisma/client").$Enums.LivestockMovementType;
        quantity: number;
        category: import(".prisma/client").$Enums.LivestockCategory;
        date: Date;
        totalPrice: import("@prisma/client/runtime/library").Decimal | null;
        notes: string | null;
    }>;
    getDashboard(): Promise<{
        totalHeads: number;
        byCategory: Record<string, number>;
        totalCattleSaleIncome: number;
    }>;
}
