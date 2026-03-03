import {
  IsInt,
  IsNumber,
  IsString,
  IsOptional,
  IsDateString,
  IsBoolean,
  IsPositive,
  IsEnum,
  Min,
  IsIn,
} from 'class-validator';
import { TreatmentType } from '@prisma/client';

// Las 6 categorías válidas de hacienda para sanidad (sin Feedlot)
export const VALID_LIVESTOCK_TYPES = [
  'TERNERO',
  'TERNERA',
  'NOVILLO',
  'VAQUILLONA',
  'TORO',
  'VACA',
] as const;
export type ValidLivestockType = (typeof VALID_LIVESTOCK_TYPES)[number];

export class CreateHealthRecordDto {
  @IsDateString()
  date: string;

  @IsIn(VALID_LIVESTOCK_TYPES)
  livestockType: ValidLivestockType;

  @IsEnum(TreatmentType)
  treatmentType: TreatmentType;

  // 0 es válido cuando appliesToAll = true
  @IsInt()
  @Min(0)
  quantity: number;

  @IsOptional()
  @IsBoolean()
  appliesToAll?: boolean;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  totalCost?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  costPerHead?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  cost?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
