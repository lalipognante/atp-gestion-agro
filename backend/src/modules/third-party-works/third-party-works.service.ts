import { Injectable } from '@nestjs/common';
import { ThirdPartyWorksRepository } from './third-party-works.repository';
import { CreateThirdPartyWorkDto } from './dto/create-third-party-work.dto';

@Injectable()
export class ThirdPartyWorksService {
  constructor(private readonly repo: ThirdPartyWorksRepository) {}

  create(dto: CreateThirdPartyWorkDto) {
    return this.repo.create(dto);
  }

  findAll(lotId?: string) {
    return this.repo.findAll(lotId);
  }
}
