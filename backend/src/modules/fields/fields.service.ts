import { Injectable } from '@nestjs/common';
import { FieldsRepository } from './fields.repository';
import { CreateFieldDto } from './dto/create-field.dto';

@Injectable()
export class FieldsService {
  constructor(private readonly fieldsRepository: FieldsRepository) {}

  async create(dto: CreateFieldDto) {
    return this.fieldsRepository.create(dto);
  }

  async findAll() {
    return this.fieldsRepository.findAll();
  }
}