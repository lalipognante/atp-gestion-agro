import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { FieldsService } from './fields.service';
import { CreateFieldDto } from './dto/create-field.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('fields')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FieldsController {
  constructor(private readonly fieldsService: FieldsService) {}

  // ADMIN puede crear
  @Post()
  @Roles(Role.ADMIN)
  create(@Body() dto: CreateFieldDto) {
    return this.fieldsService.create(dto);
  }

  // ADMIN y VIEWER pueden ver
  @Get()
  @Roles(Role.ADMIN, Role.VIEWER)
  findAll() {
    return this.fieldsService.findAll();
  }
}