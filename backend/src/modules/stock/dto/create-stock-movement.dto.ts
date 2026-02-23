import { IsString, IsNumber, IsEnum, IsOptional } from 'class-validator';
import { StockMovementType } from '@prisma/client';

export class CreateStockMovementDto {
  @IsString()
  product: string;

  @IsEnum(StockMovementType)
  movementType: StockMovementType;

  @IsNumber()
  quantity: number;

  @IsString()
  unit: string;

  @IsString()
  campaignId: string;

  @IsOptional()
  @IsNumber()
  pricePerUnit?: number;
}
