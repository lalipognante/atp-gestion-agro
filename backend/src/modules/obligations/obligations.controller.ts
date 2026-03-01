import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ObligationsService } from './obligations.service';
import { CreateObligationDto } from './dto/create-obligation.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('obligations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ObligationsController {
  constructor(private readonly service: ObligationsService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() dto: CreateObligationDto) {
    return this.service.create(dto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.VIEWER)
  findAll() {
    return this.service.findAll();
  }

  @Patch(':id/pay')
  @Roles(Role.ADMIN)
  pay(@Param('id') id: string) {
    return this.service.pay(id);
  }
}
