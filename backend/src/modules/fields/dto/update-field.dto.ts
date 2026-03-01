import { IsString, IsEnum, IsOptional } from 'class-validator';
import { FieldType } from '@prisma/client';

export class UpdateFieldDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(FieldType)
  type?: FieldType;
}
