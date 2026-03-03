import { Injectable, NotFoundException } from '@nestjs/common';
import { FieldsRepository } from './fields.repository';
import { CreateFieldDto } from './dto/create-field.dto';
import { UpdateFieldDto } from './dto/update-field.dto';

@Injectable()
export class FieldsService {
  constructor(private readonly fieldsRepository: FieldsRepository) {}

  async create(dto: CreateFieldDto) {
    return this.fieldsRepository.create(dto);
  }

  async findAll() {
    return this.fieldsRepository.findAll();
  }

  async update(id: string, dto: UpdateFieldDto) {
    const field = await this.fieldsRepository.findById(id);
    if (!field) throw new NotFoundException('Field not found');
    return this.fieldsRepository.update(id, dto);
  }
}
