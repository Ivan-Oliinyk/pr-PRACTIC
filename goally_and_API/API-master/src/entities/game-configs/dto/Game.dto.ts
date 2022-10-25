import {
  IsBoolean,
  IsDefined,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { Types } from 'mongoose';
import { urlRegex } from 'src/shared/validation/regexp';

export class GameDto {
  @IsOptional()
  _id?: Types.ObjectId;

  @IsNotEmpty()
  @IsDefined()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsBoolean()
  isActive: boolean;

  @IsNotEmpty()
  @IsString()
  @Matches(urlRegex, { message: 'imageURL is invalid' })
  imgURL: string;
}
