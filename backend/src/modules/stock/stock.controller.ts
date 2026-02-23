import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Param,
} from '@nestjs/common';
import { StockService } from './stock.service';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('stock')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() dto: CreateStockMovementDto) {
    return this.stockService.create(dto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.VIEWER)
  findAll() {
    return this.stockService.findAll();
  }

  @Get('summary/:campaignId')
  @Roles(Role.ADMIN, Role.VIEWER)
  getSummary(@Param('campaignId') campaignId: string) {
    return this.stockService.getSummary(campaignId);
  }
}
