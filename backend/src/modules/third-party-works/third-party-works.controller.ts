import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ThirdPartyWorksService } from './third-party-works.service';
import { CreateThirdPartyWorkDto } from './dto/create-third-party-work.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('third-party-works')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ThirdPartyWorksController {
  constructor(private readonly service: ThirdPartyWorksService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() dto: CreateThirdPartyWorkDto) {
    return this.service.create(dto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.VIEWER)
  findAll(@Query('lotId') lotId?: string) {
    return this.service.findAll(lotId);
  }
}
