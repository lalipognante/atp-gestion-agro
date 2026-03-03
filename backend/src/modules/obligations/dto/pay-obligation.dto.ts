import { IsDateString } from 'class-validator';

export class PayObligationDto {
  @IsDateString()
  date: string;
}
