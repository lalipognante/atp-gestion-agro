import { IsString, IsNumber, IsEnum, IsDateString, IsPositive } from 'class-validator';
import { ObligationType } from '@prisma/client';

export class CreateObligationDto {
  @IsString()
  concept: string;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsDateString()
  dueDate: string;

  @IsEnum(ObligationType)
  type: ObligationType;
}
