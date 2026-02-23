import { Injectable, NotFoundException } from '@nestjs/common';
import { CampaignsRepository } from './campaigns.repository';
import { CreateCampaignDto } from './dto/create-campaign.dto';

@Injectable()
export class CampaignsService {
  constructor(private readonly campaignsRepository: CampaignsRepository) {}

  async create(dto: CreateCampaignDto) {
    const lot = await this.campaignsRepository.lotExists(dto.lotId);

    if (!lot) {
      throw new NotFoundException('Lot not found');
    }

    return this.campaignsRepository.create(dto);
  }

  async findAll() {
    return this.campaignsRepository.findAll();
  }
}
