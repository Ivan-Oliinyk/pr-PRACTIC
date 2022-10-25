import { Expose, Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  ValidateIf,
} from 'class-validator';
import { Types } from 'mongoose';
import { IsMongoIdObj, TransformStringToObjectId } from 'src/shared/validation';
export class LoginDto {
  @IsOptional()
  @IsString()
  @Expose({ name: 'access_token' })
  accessToken: string;

  @ValidateIf(o => o.accessToken === undefined)
  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @IsPhoneNumber(null)
  @IsString()
  phoneNumber: string;

  @ValidateIf(o => o.phoneNumber === undefined)
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  invitationId: Types.ObjectId;
}
