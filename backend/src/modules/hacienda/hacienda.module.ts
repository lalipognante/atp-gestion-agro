import { Module } from '@nestjs/common';
import { HaciendaRepository } from './hacienda.repository';
import { HaciendaService } from './hacienda.service';
import { HaciendaController } from './hacienda.controller';

@Module({
  controllers: [HaciendaController],
  providers: [HaciendaRepository, HaciendaService],
})
export class HaciendaModule {}
