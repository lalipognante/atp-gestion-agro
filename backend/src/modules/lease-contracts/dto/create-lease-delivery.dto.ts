import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsEnum,
  IsOptional,
  IsDateString,
} from 'class-validator';
import { PaymentMethod } from '@prisma/client';

export class CreateLeaseDeliveryDto {
  @IsString()
  @IsNotEmpty()
  contractId: string;

  @IsDateString()
  date: string;

  @IsNumber()
  @IsPositive()
  quintales: number;

  @IsNumber()
  @IsPositive()
  amountARS: number;

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @IsOptional()
  @IsString()
  reference?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
