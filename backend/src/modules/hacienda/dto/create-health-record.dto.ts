import {
  IsEnum,
  IsInt,
  IsPositive,
  IsNumber,
  IsString,
  IsOptional,
  IsDateString,
} from 'class-validator';
import { LivestockType, TreatmentType } from '@prisma/client';

export class CreateHealthRecordDto {
  @IsDateString()
  date: string;

  @IsEnum(LivestockType)
  livestockType: LivestockType;

  @IsEnum(TreatmentType)
  treatmentType: TreatmentType;

  @IsInt()
  @IsPositive()
  quantity: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  cost?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
