import { LotsService } from './lots.service';
import { CreateLotDto } from './dto/create-lot.dto';
export declare class LotsController {
    private readonly lotsService;
    constructor(lotsService: LotsService);
    create(dto: CreateLotDto): Promise<{
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
}
