import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { ObligationsRepository } from './obligations.repository';
import { ObligationsService } from './obligations.service';
import { ObligationsController } from './obligations.controller';

@Module({
  imports: [PrismaModule],
  controllers: [ObligationsController],
  providers: [ObligationsRepository, ObligationsService],
})
export class ObligationsModule {}
