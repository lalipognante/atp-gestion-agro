import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsNumber,
  IsPositive,
} from 'class-validator';
import { ThirdPartyWorkType, Currency } from '@prisma/client';

export class CreateFarmWorkDto {
  @IsString()
  @IsNotEmpty()
  date: string;

  @IsEnum(ThirdPartyWorkType)
  workType: ThirdPartyWorkType;

  @IsString()
  @IsNotEmpty()
  lotId: string;

  @IsOptional()
  @IsString()
  responsible?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  cost?: number;

  @IsOptional()
  @IsEnum(Currency)
  currency?: Currency;

  @IsOptional()
  @IsString()
  notes?: string;
}
