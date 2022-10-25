import { Transform, Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Types } from 'mongoose';
import { NotificationDto } from 'src/entities/routines/dto/Reminder.dto';
import { ScheduleDto } from 'src/entities/routines/dto/ScheduleDto';
import { CHECKLIST_TYPE } from 'src/shared/const/checklist-type';
import { IsMongoIdObj, TransformStringToObjectId } from 'src/shared/validation';
import { urlRegex } from 'src/shared/validation/regexp';
import { ActivityDto } from './Activity.dto';
export class CreateChecklistDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  duration: number;

  @IsIn([CHECKLIST_TYPE.MANUAL, CHECKLIST_TYPE.SCHEDULED])
  type: string;

  @ValidateIf(o => o.type === CHECKLIST_TYPE.SCHEDULED)
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => ScheduleDto)
  schedule: ScheduleDto;

  @IsNotEmpty()
  @IsString()
  @Matches(urlRegex, { message: 'visualAidUrl is invalid' })
  visualAidUrl: string;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ActivityDto)
  activities: ActivityDto[];

  @Min(0)
  @IsOptional()
  @IsNumber()
  ordering: number;

  @IsBoolean()
  @IsNotEmpty()
  allowIncentivize: boolean;

  @ValidateIf(o => o.allowIncentivize)
  @IsNotEmpty()
  @IsNumber()
  numberOfPointsOnTime: number;

  @ValidateIf(o => o.allowIncentivize)
  @IsNotEmpty()
  @IsNumber()
  numberOfPointsLate: number;

  @ValidateIf(o => o.allowIncentivize)
  @IsNotEmpty()
  @IsNumber()
  numberOfPuzzlesOnTime: number;

  @ValidateIf(o => o.allowIncentivize)
  @IsNotEmpty()
  @IsNumber()
  numberOfPuzzlesLate: number;

  @IsBoolean()
  @IsNotEmpty()
  enableAudioAid: boolean;

  @IsBoolean()
  @IsNotEmpty()
  hideActAfterCom: boolean;

  @IsOptional()
  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  clientId: Types.ObjectId;

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @Type(() => Types.ObjectId)
  devices: Types.ObjectId[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NotificationDto)
  checklistNotifications: NotificationDto[];

  @IsOptional()
  @IsBoolean()
  showOnLearnerApp: boolean;

  @IsOptional()
  @IsBoolean()
  enableEmotionalFeedback: boolean;
}
