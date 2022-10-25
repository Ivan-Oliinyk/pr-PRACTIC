import { Type } from 'class-transformer';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { AttachSubscription } from 'src/entities/users/dto';
export class RegistrationWithPaymentDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  postalCode: string;

  @IsNotEmpty()
  country: string;

  @IsNotEmpty()
  plan: string;

  @IsOptional()
  paymentMethod: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => AttachSubscription)
  subscription: AttachSubscription;

  @IsInt()
  quantity: number;

  @IsString()
  sku: string;

  @IsOptional()
  @IsString()
  color: string;

  @IsOptional()
  @IsString()
  apt: string;

  @IsOptional()
  @IsString()
  state: string;
}
