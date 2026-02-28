import { CampaignsService } from './campaigns.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
export declare class CampaignsController {
    private readonly campaignsService;
    constructor(campaignsService: CampaignsService);
    create(dto: CreateCampaignDto): Promise<{
        id: string;
        createdAt: Date;
        year: number;
        lotId: string;
        crop: string;
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
        lotId: string;
        crop: string;
    })[]>;
}
