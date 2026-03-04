import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Query,
  Param,
  UseGuards,
} from '@nestjs/common';
import { FarmWorksService } from './farm-works.service';
import { CreateFarmWorkDto } from './dto/create-farm-work.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('farm-works')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FarmWorksController {
  constructor(private readonly service: FarmWorksService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() dto: CreateFarmWorkDto) {
    return this.service.create(dto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.VIEWER)
  findAll(@Query('lotId') lotId?: string) {
    return this.service.findAll(lotId);
  }

  @Patch(':id/void')
  @Roles(Role.ADMIN)
  void(@Param('id') id: string) {
    return this.service.void(id);
  }
}
