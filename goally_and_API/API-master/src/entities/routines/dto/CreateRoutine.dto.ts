import { Transform, Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsIn,
  IsNotEmptyObject,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Types } from 'mongoose';
import { CreateActivityDto } from 'src/entities/activities/dto';
import { LIBRARY_TYPES } from 'src/shared/const';
import { QUIZLET_TYPES } from 'src/shared/const/quizlet-types';
import { ROUTINES_TYPE, ROUTINE_FOLDERS } from 'src/shared/const/routine-type';
import { IsMongoIdObj, TransformStringToObjectId } from 'src/shared/validation';
import { NotificationDto } from './Reminder.dto';
import { ScheduleDto } from './ScheduleDto';
export class CreateRoutineDto {
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
  @IsNumber()
  numberOfPuzzlesLate: number;

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

  @IsString()
  imgURL: string;

  @ValidateIf(o => o.type === ROUTINES_TYPE.SCHEDULED)
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => ScheduleDto)
  schedule: ScheduleDto;

  @IsIn([LIBRARY_TYPES.ADULT, LIBRARY_TYPES.CHILD, LIBRARY_TYPES.GLOBAL])
  libraryType: string;

  @IsOptional()
  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  clientId: Types.ObjectId;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateActivityDto)
  activities: CreateActivityDto[];

  @IsOptional()
  assetSetting?: boolean;

  @IsOptional()
  @IsBoolean()
  showTimer: boolean;

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
  @IsString()
  subTitle?: string;

  @Min(0)
  @IsOptional()
  @IsNumber()
  ordering: number;

  @IsOptional()
  @IsBoolean()
  isVisibleToAudience: boolean;

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
