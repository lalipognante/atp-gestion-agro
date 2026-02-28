import { PrismaService } from '../../prisma/prisma.service';
import { CreateHaciendaMovementDto } from './dto/create-hacienda-movement.dto';
export declare class HaciendaRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
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
    findAll(): Promise<{
        id: string;
        createdAt: Date;
        type: import(".prisma/client").$Enums.LivestockMovementType;
        quantity: number;
        category: import(".prisma/client").$Enums.LivestockCategory;
        date: Date;
        totalPrice: import("@prisma/client/runtime/library").Decimal | null;
        notes: string | null;
    }[]>;
}
