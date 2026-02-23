import { FieldsRepository } from './fields.repository';
import { CreateFieldDto } from './dto/create-field.dto';
export declare class FieldsService {
    private readonly fieldsRepository;
    constructor(fieldsRepository: FieldsRepository);
    create(dto: CreateFieldDto): Promise<{
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
