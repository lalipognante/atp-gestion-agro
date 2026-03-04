import { Injectable } from '@nestjs/common';
import { FarmWorksRepository } from './farm-works.repository';
import { CreateFarmWorkDto } from './dto/create-farm-work.dto';

@Injectable()
export class FarmWorksService {
  constructor(private readonly repo: FarmWorksRepository) {}

  create(dto: CreateFarmWorkDto) {
    return this.repo.create(dto);
  }

  findAll(lotId?: string) {
    return this.repo.findAll(lotId);
  }

  void(id: string) {
    return this.repo.void(id);
  }
}
