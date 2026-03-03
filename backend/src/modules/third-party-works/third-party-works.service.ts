import { Injectable } from '@nestjs/common';
import { ThirdPartyWorksRepository } from './third-party-works.repository';
import { CreateThirdPartyWorkDto } from './dto/create-third-party-work.dto';
import { ProviderType } from '@prisma/client';

@Injectable()
export class ThirdPartyWorksService {
  constructor(private readonly repo: ThirdPartyWorksRepository) {}

  create(dto: CreateThirdPartyWorkDto) {
    return this.repo.create(dto);
  }

  findAll(lotId?: string, providerType?: ProviderType) {
    return this.repo.findAll(lotId, providerType);
  }

  markPaid(id: string) {
    return this.repo.markPaid(id);
  }

  void(id: string) {
    return this.repo.void(id);
  }
}
