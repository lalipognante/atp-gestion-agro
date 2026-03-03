import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  UseGuards,
  Param,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { FinancialService } from './financial.service';
import { CreateFinancialMovementDto } from './dto/create-financial-movement.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('financial')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FinancialController {
  constructor(private readonly service: FinancialService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() dto: CreateFinancialMovementDto) {
    return this.service.create(dto);
  }

  @Get()
  @Roles(Role.ADMIN)
  findAll() {
    return this.service.findAll();
  }

  @Get('balance/:campaignId')
  @Roles(Role.ADMIN)
  getBalance(@Param('campaignId') campaignId: string) {
    return this.service.getBalanceByCampaign(campaignId);
  }

  @Patch(':id/void')
  @Roles(Role.ADMIN)
  async void(@Param('id') id: string) {
    try {
      return await this.service.void(id);
    } catch (e: any) {
      if (e.message === 'Not found') throw new NotFoundException();
      if (e.message === 'Already voided') throw new BadRequestException('Already voided');
      throw e;
    }
  }
}
