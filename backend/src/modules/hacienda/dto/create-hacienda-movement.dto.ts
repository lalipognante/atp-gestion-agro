import {
  IsEnum,
  IsInt,
  IsPositive,
  IsNumber,
  IsString,
  IsOptional,
  IsDateString,
  IsIn,
  ValidateNested,
  ArrayMinSize,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { LivestockMovementType, LivestockCategory, LivestockCategoryV2 } from '@prisma/client';

const VALID_CATEGORIES_V2 = [
  'TERNERO', 'TERNERA', 'NOVILLO', 'VAQUILLONA', 'TORO', 'VACA',
] as const;

export class LivestockMovementItemDto {
  @IsIn(VALID_CATEGORIES_V2)
  category: LivestockCategoryV2;

  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateHaciendaMovementDto {
  @IsDateString()
  date: string;

  @IsEnum(LivestockMovementType)
  type: LivestockMovementType;

  // ── SALE / PURCHASE: campos por kilo ─────────────────────
  @IsOptional()
  @IsNumber()
  @IsPositive()
  avgWeightKg?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  pricePerKg?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  totalAmount?: number;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => LivestockMovementItemDto)
  @ArrayMinSize(1)
  items?: LivestockMovementItemDto[];

  // ── Legacy: INCOME / DEATH / TRANSFER / ADJUSTMENT ───────
  @IsOptional()
  @IsEnum(LivestockCategory)
  category?: LivestockCategory;

  @IsOptional()
  @IsEnum(LivestockCategoryV2)
  categoryV2?: LivestockCategoryV2;

  @IsOptional()
  @IsInt()
  @Min(1)
  quantity?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  totalPrice?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
