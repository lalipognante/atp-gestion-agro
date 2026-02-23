import { Module } from '@nestjs/common';
import { LotsService } from './lots.service';
import { LotsRepository } from './lots.repository';
import { LotsController } from './lots.controller';

@Module({
  controllers: [LotsController],
  providers: [LotsService, LotsRepository],
})
export class LotsModule {}
