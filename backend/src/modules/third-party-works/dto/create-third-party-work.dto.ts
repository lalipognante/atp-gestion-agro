import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsNumber,
  IsPositive,
  ValidateIf,
} from 'class-validator';
import {
  ThirdPartyWorkType,
  PaymentMethod,
  Currency,
  ProviderType,
  ThirdPartyWorkStatus,
} from '@prisma/client';

export class CreateThirdPartyWorkDto {
  @IsString()
  @IsNotEmpty()
  date: string;

  @IsEnum(ThirdPartyWorkType)
  workType: ThirdPartyWorkType;

  @IsString()
  @IsNotEmpty()
  lotId: string;

  @IsString()
  @IsNotEmpty()
  contractor: string;

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @ValidateIf((o) => o.paymentMethod !== PaymentMethod.QUINTALES)
  @IsNumber()
  @IsPositive()
  amount?: number;

  @ValidateIf((o) => o.paymentMethod !== PaymentMethod.QUINTALES)
  @IsEnum(Currency)
  currency?: Currency;

  @ValidateIf((o) => o.paymentMethod === PaymentMethod.QUINTALES)
  @IsNumber()
  @IsPositive()
  quintales?: number;

  @IsOptional()
  @IsString()
  grainType?: string;

  @IsOptional()
  @IsString()
  reference?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsEnum(ProviderType)
  providerType?: ProviderType;

  @IsOptional()
  @IsEnum(ThirdPartyWorkStatus)
  status?: ThirdPartyWorkStatus;
}
