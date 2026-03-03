import { IsString, IsNotEmpty, IsInt, IsPositive, IsNumber, IsOptional } from 'class-validator';

export class CreateLeaseContractDto {
  @IsString()
  @IsNotEmpty()
  fieldId: string;

  @IsInt()
  @IsPositive()
  year: number;

  @IsNumber()
  @IsPositive()
  totalQuintales: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
