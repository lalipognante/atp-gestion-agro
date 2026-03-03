import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { ThirdPartyWorksRepository } from './third-party-works.repository';
import { ThirdPartyWorksService } from './third-party-works.service';
import { ThirdPartyWorksController } from './third-party-works.controller';

@Module({
  imports: [PrismaModule],
  controllers: [ThirdPartyWorksController],
  providers: [ThirdPartyWorksRepository, ThirdPartyWorksService],
  exports: [ThirdPartyWorksService],
})
export class ThirdPartyWorksModule {}
