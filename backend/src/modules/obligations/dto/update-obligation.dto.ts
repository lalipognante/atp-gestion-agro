import { IsString, IsNumber, IsEnum, IsDateString, IsPositive, IsOptional } from 'class-validator';
import { ObligationType } from '@prisma/client';

export class UpdateObligationDto {
  @IsOptional()
  @IsString()
  concept?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  amount?: number;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsEnum(ObligationType)
  type?: ObligationType;
}
