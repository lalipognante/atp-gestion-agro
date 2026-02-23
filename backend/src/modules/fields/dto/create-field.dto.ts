import { IsString, IsEnum } from 'class-validator';
import { FieldType } from '@prisma/client';

export class CreateFieldDto {
  @IsString()
  name: string;

  @IsEnum(FieldType)
  type: FieldType;
}