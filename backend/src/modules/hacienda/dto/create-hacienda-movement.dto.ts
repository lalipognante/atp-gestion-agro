import {
  IsEnum,
  IsInt,
  IsPositive,
  IsNumber,
  IsString,
  IsOptional,
  IsDateString,
} from 'class-validator';
import { LivestockMovementType, LivestockCategory } from '@prisma/client';

export class CreateHaciendaMovementDto {
  @IsDateString()
  date: string;

  @IsEnum(LivestockCategory)
  category: LivestockCategory;

  @IsEnum(LivestockMovementType)
  type: LivestockMovementType;

  @IsInt()
  quantity: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  totalPrice?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
