import { IsUUID, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateLotDto {
  @IsUUID()
  fieldId: string;

  @IsNumber()
  surfaceHa: number;

  @IsOptional()
  @IsString()
  location?: string;
}
