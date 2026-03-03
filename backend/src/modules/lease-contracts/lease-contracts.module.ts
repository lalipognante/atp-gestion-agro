import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { LeaseContractsService } from './lease-contracts.service';
import { LeaseContractsController } from './lease-contracts.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [LeaseContractsService],
  controllers: [LeaseContractsController],
  exports: [LeaseContractsService],
})
export class LeaseContractsModule {}
