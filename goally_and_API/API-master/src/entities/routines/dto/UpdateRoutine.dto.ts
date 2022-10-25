import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsDateString,
  IsIn,
  IsNotEmptyObject,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Types } from 'mongoose';
import { CreateActivityDto } from 'src/entities/activities/dto';
import { QUIZLET_TYPES } from 'src/shared/const/quizlet-types';
import { ROUTINES_TYPE, ROUTINE_FOLDERS } from 'src/shared/const/routine-type';
import { NotificationDto } from './Reminder.dto';
import { ScheduleDto } from './ScheduleDto';
export class UpdateRoutineDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  numberOfPointsOnTime: number;

  @IsOptional()
  @IsNumber()
  numberOfPointsLate: number;

  @IsOptional()
  @IsNumber()
  numberOfPuzzlesOnTime: number;

  @IsOptional()
  @IsDateString()
  skipUntil: Date;

  @IsOptional()
  @IsNumber()
  numberOfPuzzlesLate: number;

  @IsOptional()
  @IsBoolean()
  showTimer: boolean;

  @IsOptional()
  @IsIn([ROUTINES_TYPE.MANUAL, ROUTINES_TYPE.SCHEDULED])
  type: string;

  @IsOptional()
  @IsIn([
    ROUTINE_FOLDERS.BEHAVIOR_THERAPY,
    ROUTINE_FOLDERS.DAILY_ROUTINES,
    ROUTINE_FOLDERS.FUN,
    ROUTINE_FOLDERS.OCCUPATIONAL_THERAPY,
    ROUTINE_FOLDERS.SCHOOL,
    ROUTINE_FOLDERS.SPEECH_THERAPY,
  ])
  routineFolder?: string;

  @IsOptional()
  @IsString()
  imgURL: string;

  @IsOptional()
  @IsNumber()
  ordering: number;

  @IsOptional()
  @ValidateIf(o => o.type === ROUTINES_TYPE.SCHEDULED)
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => ScheduleDto)
  schedule: ScheduleDto;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateActivityDto)
  activities: CreateActivityDto[];

  @IsOptional()
  assetSetting: boolean;

  @IsOptional()
  @IsBoolean()
  allowToOverride: boolean;

  @IsOptional()
  @IsBoolean()
  allowClientToCancel: boolean;

  @IsOptional()
  @IsBoolean()
  showOnLearnerApp: boolean;

  @IsOptional()
  @IsBoolean()
  isVisibleToAudience: boolean;

  @IsOptional()
  @IsBoolean()
  isMarkedHot: boolean;

  @IsOptional()
  @IsBoolean()
  addOnUserCreation: boolean;

  @IsOptional()
  @IsBoolean()
  addOnClientCreation: boolean;

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @Type(() => Types.ObjectId)
  devices: Types.ObjectId[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NotificationDto)
  routineNotifications: NotificationDto[];

  @IsOptional()
  @IsString()
  @IsIn([QUIZLET_TYPES.MORNING, QUIZLET_TYPES.BEDTIME, QUIZLET_TYPES.OTHER])
  category: string;

  @IsOptional()
  @IsBoolean()
  enableEmotionalFeedback: boolean;

  @IsOptional()
  @IsBoolean()
  allowIncentivize: boolean;

  lastSchedule?: ScheduleDto;
}
