import { Injectable } from '@nestjs/common';
import { FinancialRepository } from './financial.repository';

@Injectable()
export class FinancialService {
  constructor(private readonly repo: FinancialRepository) {}

  async findAll() {
    return this.repo.findAll();
  }
}
