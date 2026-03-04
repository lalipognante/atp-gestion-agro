import { Module } from '@nestjs/common';
import { FarmWorksController } from './farm-works.controller';
import { FarmWorksService } from './farm-works.service';
import { FarmWorksRepository } from './farm-works.repository';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FarmWorksController],
  providers: [FarmWorksService, FarmWorksRepository],
})
export class FarmWorksModule {}
