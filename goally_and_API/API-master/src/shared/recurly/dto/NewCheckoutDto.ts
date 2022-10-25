import { Transform, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEmail,
  IsIn,
  IsISO31661Alpha2,
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
  MinLength,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Types } from 'mongoose';
import { PAYMENT_MEDIUMS } from 'src/shared/const/payment-mediums';
import { RECURLY_CURRENCIES } from 'src/shared/const/recurly-currencies';
import { RECURLY_ITEMS } from 'src/shared/const/recurly-items';
import { RECURLY_PLANS } from 'src/shared/const/recurly-plans';
import { IsMongoIdObj, TransformStringToObjectId } from 'src/shared/validation';
import { namePattern } from 'src/shared/validation/regexp';

export class UserInfo {
  @IsNotEmpty()
  @Matches(namePattern)
  @MinLength(1)
  firstName: string;

  @IsNotEmpty()
  @Matches(namePattern)
  @MinLength(1)
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  state: string;

  @IsISO31661Alpha2()
  @IsNotEmpty()
  @IsString()
  country: string;

  @IsNotEmpty()
  @IsString()
  postal: string;

  @IsOptional()
  @IsString()
  apt: string;

  @IsPhoneNumber(null)
  @IsNotEmpty()
  @IsString()
  phone: string;
}
export class PlanInfoDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(Object.values(RECURLY_PLANS))
  planCode: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(Object.values(RECURLY_ITEMS))
  deviceItemCode: string;
}

export class NewCheckoutDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => PlanInfoDto)
  plansInfo: PlanInfoDto[];

  @ValidateIf(o => !o.isBillingSameAsShipping)
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => UserInfo)
  billingInfo: UserInfo;

  @IsNotEmpty()
  @IsBoolean()
  isBillingSameAsShipping: boolean;

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => UserInfo)
  shippingInfo: UserInfo;

  @IsOptional()
  @IsString()
  referralCode: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(Object.values(PAYMENT_MEDIUMS))
  paymentMedium: string;

  @IsOptional()
  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  userId: Types.ObjectId;

  @ValidateIf(o => o.paymentMedium !== PAYMENT_MEDIUMS.MAIL_A_CHEQUE)
  @IsNotEmpty()
  @IsString()
  recurlyTokenId: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(Object.values(RECURLY_CURRENCIES))
  currency: string;

  @IsOptional()
  @IsString()
  threeDSecureActionResultTokenId: string;
}
