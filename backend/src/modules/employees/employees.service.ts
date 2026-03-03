import { Injectable } from '@nestjs/common';
import { EmployeesRepository } from './employees.repository';
import { CreateEmployeeDto } from './dto/create-employee.dto';

@Injectable()
export class EmployeesService {
  constructor(private readonly repo: EmployeesRepository) {}

  create(dto: CreateEmployeeDto) {
    return this.repo.create(dto);
  }

  findAll() {
    return this.repo.findAll();
  }
}
