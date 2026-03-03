import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { LeaseContractsService } from './lease-contracts.service';
import { CreateLeaseContractDto } from './dto/create-lease-contract.dto';
import { CreateLeaseDeliveryDto } from './dto/create-lease-delivery.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('lease-contracts')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LeaseContractsController {
  constructor(private readonly service: LeaseContractsService) {}

  // ── Contracts ─────────────────────────────────────────────────────────────

  @Post()
  @Roles(Role.ADMIN)
  createContract(@Body() dto: CreateLeaseContractDto) {
    return this.service.createContract(dto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.VIEWER)
  findAllContracts(@Query('fieldId') fieldId?: string) {
    return fieldId
      ? this.service.findContractsByField(fieldId)
      : this.service.findAllContracts();
  }

  @Get(':fieldId/summary')
  @Roles(Role.ADMIN, Role.VIEWER)
  getContractSummary(@Param('fieldId') fieldId: string) {
    return this.service.getContractSummary(fieldId);
  }

  @Patch(':id/void')
  @Roles(Role.ADMIN)
  voidContract(@Param('id') id: string) {
    return this.service.voidContract(id);
  }

  // ── Deliveries ────────────────────────────────────────────────────────────

  @Post('deliveries')
  @Roles(Role.ADMIN)
  createDelivery(@Body() dto: CreateLeaseDeliveryDto) {
    return this.service.createDelivery(dto);
  }

  @Patch('deliveries/:id/void')
  @Roles(Role.ADMIN)
  voidDelivery(@Param('id') id: string) {
    return this.service.voidDelivery(id);
  }
}
