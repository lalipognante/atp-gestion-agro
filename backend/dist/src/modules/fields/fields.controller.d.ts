import { FieldsService } from './fields.service';
import { CreateFieldDto } from './dto/create-field.dto';
export declare class FieldsController {
    private readonly fieldsService;
    constructor(fieldsService: FieldsService);
    create(dto: CreateFieldDto): Promise<{
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
