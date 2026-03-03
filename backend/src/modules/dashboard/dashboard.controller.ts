import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardController {
  constructor(private readonly service: DashboardService) {}

  @Get()
  @Roles(Role.ADMIN, Role.VIEWER)
  getSummary() {
    return this.service.getSummary();
  }

  @Get('yield')
  @Roles(Role.ADMIN, Role.VIEWER)
  getYield() {
    return this.service.getYield();
  }
}
