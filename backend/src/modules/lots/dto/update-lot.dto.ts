import { IsString, IsNumber, IsUUID, IsOptional, IsPositive } from 'class-validator';

export class UpdateLotDto {
  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  surfaceHa?: number;

  @IsOptional()
  @IsUUID()
  fieldId?: string;
}
