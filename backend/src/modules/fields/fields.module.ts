import { Module } from '@nestjs/common';
import { FieldsService } from './fields.service';
import { FieldsRepository } from './fields.repository';
import { FieldsController } from './fields.controller';

@Module({
  controllers: [FieldsController],
  providers: [FieldsService, FieldsRepository],
})
export class FieldsModule {}