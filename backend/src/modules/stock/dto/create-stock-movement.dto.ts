import {
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsPositive,
  IsUUID,
  IsDateString,
} from 'class-validator';
import { StockMovementType } from '@prisma/client';

export class CreateStockMovementDto {
  @IsString()
  product: string;

  @IsEnum(StockMovementType)
  movementType: StockMovementType;

  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsString()
  unit: string;

  @IsOptional()
  @IsUUID()
  lotId?: string;

  @IsOptional()
  @IsUUID()
  campaignId?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  pricePerUnit?: number;

  @IsOptional()
  @IsDateString()
  date?: string;
}
