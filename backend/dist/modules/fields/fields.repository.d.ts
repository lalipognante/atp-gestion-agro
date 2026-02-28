import { PrismaService } from '../../prisma/prisma.service';
import { FieldType } from '@prisma/client';
export declare class FieldsRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: {
        name: string;
        type: FieldType;
    }): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        type: import(".prisma/client").$Enums.FieldType;
    }>;
    findAll(): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        type: import(".prisma/client").$Enums.FieldType;
    }[]>;
}
