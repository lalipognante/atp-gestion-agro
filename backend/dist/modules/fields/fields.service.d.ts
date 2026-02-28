import { FieldsRepository } from './fields.repository';
import { CreateFieldDto } from './dto/create-field.dto';
export declare class FieldsService {
    private readonly fieldsRepository;
    constructor(fieldsRepository: FieldsRepository);
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
