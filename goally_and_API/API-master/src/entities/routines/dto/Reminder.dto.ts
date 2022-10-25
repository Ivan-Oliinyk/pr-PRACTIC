import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';
import { Types } from 'mongoose';

export class NotificationDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsBoolean()
  isActive: boolean;

  @IsNotEmpty()
  @IsString()
  @IsUrl()
  audioUrl: string;

  @IsNotEmpty()
  @IsBoolean()
  isReadText: boolean;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  timeBefore: number;

  @IsOptional()
  _id: Types.ObjectId;
}
