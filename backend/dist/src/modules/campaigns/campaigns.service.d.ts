import { CampaignsRepository } from './campaigns.repository';
import { CreateCampaignDto } from './dto/create-campaign.dto';
export declare class CampaignsService {
    private readonly campaignsRepository;
    constructor(campaignsRepository: CampaignsRepository);
    create(dto: CreateCampaignDto): Promise<{
        id: string;
        createdAt: Date;
        year: number;
        crop: string;
        lotId: string;
    }>;
    findAll(): Promise<({
        lot: {
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
        };
    } & {
        id: string;
        createdAt: Date;
        year: number;
        crop: string;
        lotId: string;
    })[]>;
}
