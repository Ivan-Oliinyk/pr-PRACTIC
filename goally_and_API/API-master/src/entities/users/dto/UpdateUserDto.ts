import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { Types } from 'mongoose';
import { USER_TYPES } from 'src/shared/const';
import { USER_PLANS } from 'src/shared/const/user-plans';
import { IsMongoIdObj, TransformStringToObjectId } from 'src/shared/validation';
import { namePattern, passwordRegex } from 'src/shared/validation/regexp';
export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsNotEmpty()
  @Matches(namePattern)
  @MinLength(1)
  firstName: string;

  @IsOptional()
  @IsNotEmpty()
  @Matches(namePattern)
  @MinLength(1)
  lastName: string;

  @IsOptional()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(passwordRegex)
  password: string;

  @IsOptional()
  @IsPhoneNumber(null)
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @IsOptional()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(passwordRegex)
  passwordConfirmation: string;

  @IsOptional()
  @IsIn(Object.values(USER_TYPES))
  type: string;

  @IsOptional()
  otherType: string;

  @IsOptional()
  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  invitationId: Types.ObjectId;

  @IsOptional()
  @IsNotEmpty()
  postalCode: string;

  @IsOptional()
  @IsNotEmpty()
  country: string;

  @IsOptional()
  @IsIn(Object.values(USER_PLANS))
  plan: string;

  @IsOptional()
  @IsNotEmpty()
  address: string;

  @IsOptional()
  apt: string;

  @IsOptional()
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  alternateEmail: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  city: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  state: string;
}
