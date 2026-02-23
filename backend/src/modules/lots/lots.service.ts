import { Injectable, NotFoundException } from '@nestjs/common';
import { LotsRepository } from './lots.repository';
import { CreateLotDto } from './dto/create-lot.dto';

@Injectable()
export class LotsService {
  constructor(private readonly lotsRepository: LotsRepository) {}

  async create(dto: CreateLotDto) {
    const field = await this.lotsRepository.fieldExists(dto.fieldId);

    if (!field) {
      throw new NotFoundException('Field not found');
    }

    return this.lotsRepository.create(dto);
  }

  async findAll() {
    return this.lotsRepository.findAll();
  }
}
