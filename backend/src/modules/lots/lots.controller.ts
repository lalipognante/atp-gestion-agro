import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { LotsService } from './lots.service';
import { CreateLotDto } from './dto/create-lot.dto';
import { UpdateLotDto } from './dto/update-lot.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('lots')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LotsController {
  constructor(private readonly lotsService: LotsService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() dto: CreateLotDto) {
    return this.lotsService.create(dto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.VIEWER)
  findAll() {
    return this.lotsService.findAll();
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateLotDto) {
    return this.lotsService.update(id, dto);
  }
}
