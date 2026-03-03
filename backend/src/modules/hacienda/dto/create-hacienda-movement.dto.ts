import {
  IsEnum,
  IsInt,
  IsPositive,
  IsNumber,
  IsString,
  IsOptional,
  IsDateString,
} from 'class-validator';
import { LivestockMovementType, LivestockCategory, LivestockCategoryV2 } from '@prisma/client';

export class CreateHaciendaMovementDto {
  @IsDateString()
  date: string;

  @IsOptional()
  @IsEnum(LivestockCategory)
  category?: LivestockCategory;

  @IsOptional()
  @IsEnum(LivestockCategoryV2)
  categoryV2?: LivestockCategoryV2;

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
