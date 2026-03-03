import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { HaciendaService } from './hacienda.service';
import { CreateHaciendaMovementDto } from './dto/create-hacienda-movement.dto';
import { CreateHealthRecordDto } from './dto/create-health-record.dto';
import { HealthRepository } from './health.repository';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('hacienda')
@UseGuards(JwtAuthGuard, RolesGuard)
export class HaciendaController {
  constructor(
    private readonly service: HaciendaService,
    private readonly healthRepo: HealthRepository,
  ) {}

  @Post('movements')
  @Roles(Role.ADMIN)
  create(@Body() dto: CreateHaciendaMovementDto) {
    return this.service.create(dto);
  }

  @Get('dashboard')
  @Roles(Role.ADMIN, Role.VIEWER)
  getDashboard() {
    return this.service.getDashboard();
  }

  @Post('health')
  @Roles(Role.ADMIN)
  createHealth(@Body() dto: CreateHealthRecordDto) {
    return this.healthRepo.create(dto);
  }

  @Get('health')
  @Roles(Role.ADMIN, Role.VIEWER)
  findAllHealth() {
    return this.healthRepo.findAll();
  }
}
