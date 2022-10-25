import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';
import { Types } from 'mongoose';
import { urlRegex } from 'src/shared/validation/regexp';
import { ScheduleDto } from '../../routines/dto/ScheduleDto';
import { NotificationDto } from './NotificationDto';

export class CreateReminderDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => ScheduleDto)
  schedule: ScheduleDto;

  @IsNotEmpty()
  @IsNumber()
  duration: number;

  @IsNotEmpty()
  @IsString()
  @Matches(urlRegex, { message: 'visualAidUrl is invalid' })
  visualAidUrl: string;

  @IsArray()
  @ArrayMinSize(0)
  @ValidateNested()
  @Type(() => NotificationDto)
  notifications: NotificationDto[];

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @Type(() => Types.ObjectId)
  devices: Types.ObjectId[];

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  type: string;
}
