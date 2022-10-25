import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  ValidateIf,
} from 'class-validator';
import { APPS } from 'src/shared/const/applications';
import { CONNECTION_TYPES } from 'src/shared/const/connection-types';

export class SendOtpDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(Object.values(CONNECTION_TYPES))
  connection: string;

  @ValidateIf(o => o.connection === CONNECTION_TYPES.EMAIL)
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ValidateIf(o => o.connection === CONNECTION_TYPES.SMS)
  @IsNotEmpty()
  @IsPhoneNumber(null)
  phone_number: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(Object.values(APPS))
  app: string;
}
