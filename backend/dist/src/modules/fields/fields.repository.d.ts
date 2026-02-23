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
        name: string;
        type: import(".prisma/client").$Enums.FieldType;
        createdAt: Date;
    }>;
    findAll(): Promise<{
        id: string;
        name: string;
        type: import(".prisma/client").$Enums.FieldType;
        createdAt: Date;
    }[]>;
}
