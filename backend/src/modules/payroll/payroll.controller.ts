import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { PayrollService } from './payroll.service';
import { CreateSalaryPaymentDto } from './dto/create-salary-payment.dto';
import { CreateSalaryAdvanceDto } from './dto/create-salary-advance.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('payroll')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PayrollController {
  constructor(private readonly service: PayrollService) {}

  @Post('payments')
  @Roles(Role.ADMIN)
  createPayment(@Body() dto: CreateSalaryPaymentDto) {
    return this.service.createPayment(dto);
  }

  @Post('advances')
  @Roles(Role.ADMIN)
  createAdvance(@Body() dto: CreateSalaryAdvanceDto) {
    return this.service.createAdvance(dto);
  }

  @Get('payments')
  @Roles(Role.ADMIN, Role.VIEWER)
  findAllPayments() {
    return this.service.findAllPayments();
  }

  @Get('advances')
  @Roles(Role.ADMIN, Role.VIEWER)
  findAllAdvances() {
    return this.service.findAllAdvances();
  }
}
