import { Transform, Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Types } from 'mongoose';
import { ScheduleDto } from 'src/entities/routines/dto/ScheduleDto';
import { Routine } from 'src/entities/routines/schema/routine.schema';
import { LIBRARY_TYPES } from 'src/shared/const';
import { ROUTINES_TYPE } from 'src/shared/const/routine-type';
import {
  GreaterOrEqualThen,
  IsMongoIdObj,
  TransformStringToObjectId,
} from 'src/shared/validation';
import {
  INITIATOR,
  STATUS_PLAYED_ACTIVITY,
  STATUS_PLAYED_ROUTINE,
} from '../const';
class TimeRange {
  @IsNotEmpty()
  @IsDateString()
  startedAt: Date;

  @IsNotEmpty()
  @IsDateString()
  finishedAt: Date;
}
class InnerRoutine {
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

  @IsString()
  imgURL: string;

  @ValidateIf(o => o.type === ROUTINES_TYPE.SCHEDULED)
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => ScheduleDto)
  schedule: ScheduleDto;

  @IsIn([LIBRARY_TYPES.ADULT, LIBRARY_TYPES.CHILD])
  libraryType: string;

  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  clientId: Types.ObjectId;

  @IsOptional()
  @ValidateIf(o => o.libraryType === LIBRARY_TYPES.CHILD)
  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  parentRoutineId?: Types.ObjectId;

  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  _id?: Types.ObjectId;

  @IsOptional()
  createdBy?: Types.ObjectId;

  @IsOptional()
  @IsBoolean()
  showTimer: boolean;

  @IsOptional()
  @IsBoolean()
  allowIncentivize: boolean;
}

class InnerActivity {
  @IsString()
  name: string;

  @IsNumber()
  @Min(0)
  minCompletionTime: number;

  @Min(0.1)
  @IsNumber()
  @GreaterOrEqualThen('minCompletionTime')
  maxCompletionTime: number;

  @IsOptional()
  @IsString()
  audioUrl: string;

  @IsOptional()
  @IsString()
  imgURL: string;

  @IsBoolean()
  allowCancelActivity: boolean;

  @IsBoolean()
  allowPauseActivity: boolean;

  @IsBoolean()
  allowPush: boolean;

  @IsOptional()
  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  clientId?: Types.ObjectId;

  @IsNumber()
  ordering: number;

  @IsIn([LIBRARY_TYPES.ADULT, LIBRARY_TYPES.CHILD])
  libraryType: string;

  @IsOptional()
  @ValidateIf(o => o.libraryType === LIBRARY_TYPES.CHILD)
  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  parentActivityId?: Types.ObjectId;

  @IsIn(Object.values(STATUS_PLAYED_ACTIVITY))
  status: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TimeRange)
  timeRanges: TimeRange[];

  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  _id?: Types.ObjectId;

  @IsOptional()
  createdBy?: Types.ObjectId;

  @IsOptional()
  @IsBoolean()
  hasBeenPaused: boolean;

  @IsOptional()
  @IsBoolean()
  hasBeenSkipped: boolean;

  @IsOptional()
  @IsBoolean()
  autoComplete: boolean;
}

export class SaveOfflinePlayedRoutine {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => InnerActivity)
  activities: InnerActivity[];

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => InnerRoutine)
  routine: Routine;

  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  routineId: Types.ObjectId;

  @IsIn(Object.values(INITIATOR))
  initiator: string;

  @IsIn(Object.keys(STATUS_PLAYED_ROUTINE))
  status: string;

  @IsDateString()
  finishedAt: Date;

  @IsOptional()
  @IsDateString()
  startedAtWebPortal: Date;

  @IsOptional()
  @IsDateString()
  startedAtDevice: Date;
}
