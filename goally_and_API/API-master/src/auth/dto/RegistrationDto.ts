import { Transform } from 'class-transformer';
import {
  IsBoolean,
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
import { IsMongoIdObj, TransformStringToObjectId } from 'src/shared/validation';
import { namePattern, passwordRegex } from 'src/shared/validation/regexp';
export class RegistrationDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Matches(namePattern)
  @MinLength(1)
  firstName: string;

  @IsNotEmpty()
  @Matches(namePattern)
  @MinLength(1)
  lastName: string;

  @IsOptional()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(passwordRegex)
  password: string;

  @IsIn(Object.values(USER_TYPES))
  type: string;

  @IsOptional()
  otherType: string;

  @IsOptional()
  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  invitationId: Types.ObjectId;

  @IsNotEmpty()
  postalCode: string;

  @IsNotEmpty()
  country: string;

  @IsNotEmpty()
  plan: string;

  @IsNotEmpty()
  address: string;

  @IsOptional()
  @IsString()
  state: string;

  @IsOptional()
  @IsBoolean()
  isSiteLicense: boolean;

  @IsOptional()
  @IsPhoneNumber(null)
  @IsString()
  phoneNumber: string;
}
