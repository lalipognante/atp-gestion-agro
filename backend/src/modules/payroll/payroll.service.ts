import { Injectable } from '@nestjs/common';
import { PayrollRepository } from './payroll.repository';
import { CreateSalaryPaymentDto } from './dto/create-salary-payment.dto';
import { CreateSalaryAdvanceDto } from './dto/create-salary-advance.dto';

@Injectable()
export class PayrollService {
  constructor(private readonly repo: PayrollRepository) {}

  createPayment(dto: CreateSalaryPaymentDto) {
    return this.repo.createPayment(dto);
  }

  createAdvance(dto: CreateSalaryAdvanceDto) {
    return this.repo.createAdvance(dto);
  }

  findAllPayments() {
    return this.repo.findAllPayments();
  }

  findAllAdvances() {
    return this.repo.findAllAdvances();
  }
}
