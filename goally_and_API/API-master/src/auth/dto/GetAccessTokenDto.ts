import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { APPS } from 'src/shared/const/applications';
import { CONNECTION_TYPES } from 'src/shared/const/connection-types';

export class GetAccessTokenDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(Object.values(CONNECTION_TYPES))
  realm: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  otp: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(Object.values(APPS))
  app: string;
}
