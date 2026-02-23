import { IsUUID, IsInt, IsString } from 'class-validator';

export class CreateCampaignDto {
  @IsUUID()
  lotId: string;

  @IsInt()
  year: number;

  @IsString()
  crop: string;
}
