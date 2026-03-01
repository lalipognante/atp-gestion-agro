import {
  IsEnum,
  IsNumber,
  IsPositive,
  IsOptional,
  IsString,
  IsUUID,
  IsDateString,
} from 'class-validator';
import { FinancialDirection, Currency } from '@prisma/client';

export class CreateFinancialMovementDto {
  @IsEnum(FinancialDirection)
  direction: FinancialDirection;

  @IsOptional()
  @IsString()
  category?: string;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsEnum(Currency)
  currency: Currency;

  @IsOptional()
  @IsUUID()
  campaignId?: string;

  @IsOptional()
  @IsUUID()
  stockMovementId?: string;

  @IsOptional()
  @IsDateString()
  date?: string;
}
