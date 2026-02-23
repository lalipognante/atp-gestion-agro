import { Controller, Get, UseGuards } from '@nestjs/common';
import { FinancialService } from './financial.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('financial')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FinancialController {
  constructor(private readonly service: FinancialService) {}

  @Get()
  @Roles(Role.ADMIN)
  findAll() {
    return this.service.findAll();
  }
}
