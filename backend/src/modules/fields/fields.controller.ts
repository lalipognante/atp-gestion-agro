import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { FieldsService } from './fields.service';
import { CreateFieldDto } from './dto/create-field.dto';
import { UpdateFieldDto } from './dto/update-field.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('fields')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FieldsController {
  constructor(private readonly fieldsService: FieldsService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() dto: CreateFieldDto) {
    return this.fieldsService.create(dto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.VIEWER)
  findAll() {
    return this.fieldsService.findAll();
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateFieldDto) {
    return this.fieldsService.update(id, dto);
  }
}
