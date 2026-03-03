import {
  IsEnum,
  IsNumber,
  IsPositive,
  IsOptional,
  IsString,
  IsUUID,
  IsDateString,
} from 'class-validator';
import { FinancialDirection, Currency, PaymentMethod } from '@prisma/client';

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
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod;

  @IsOptional()
  @IsString()
  reference?: string;

  @IsOptional()
  @IsString()
  counterparty?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsUUID()
  campaignId?: string;

  @IsOptional()
  @IsUUID()
  stockMovementId?: string;

  @IsDateString()
  date: string;
}
