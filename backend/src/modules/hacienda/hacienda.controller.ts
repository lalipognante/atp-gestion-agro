import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { HaciendaService } from './hacienda.service';
import { CreateHaciendaMovementDto } from './dto/create-hacienda-movement.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('hacienda')
@UseGuards(JwtAuthGuard, RolesGuard)
export class HaciendaController {
  constructor(private readonly service: HaciendaService) {}

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
}
