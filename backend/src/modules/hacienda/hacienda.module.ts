import { Module } from '@nestjs/common';
import { HaciendaRepository } from './hacienda.repository';
import { HaciendaService } from './hacienda.service';
import { HaciendaController } from './hacienda.controller';
import { HealthRepository } from './health.repository';

@Module({
  controllers: [HaciendaController],
  providers: [HaciendaRepository, HaciendaService, HealthRepository],
})
export class HaciendaModule {}
