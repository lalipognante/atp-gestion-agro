import { HaciendaRepository } from './hacienda.repository';
import { CreateHaciendaMovementDto } from './dto/create-hacienda-movement.dto';
import { PrismaService } from '../../prisma/prisma.service';
export declare class HaciendaService {
    private readonly repo;
    private readonly prisma;
    constructor(repo: HaciendaRepository, prisma: PrismaService);
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
