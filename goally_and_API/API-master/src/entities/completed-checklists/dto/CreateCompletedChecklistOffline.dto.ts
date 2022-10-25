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
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Types } from 'mongoose';
import { Checklist } from 'src/entities/checklists/schema/checklist.schema';
import { ScheduleDto } from 'src/entities/routines/dto/ScheduleDto';
import { ROUTINES_TYPE } from 'src/shared/const/routine-type';
import { IsMongoIdObj, TransformStringToObjectId } from 'src/shared/validation';
import {
  INITIATOR,
  STATUS_PLAYED_ACTIVITY,
  STATUS_PLAYED_CHECKLIST,
} from '../const';

class InnerChecklist {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  duration: number;

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
  visualAidUrl: string;

  @ValidateIf(o => o.type === ROUTINES_TYPE.SCHEDULED)
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => ScheduleDto)
  schedule: ScheduleDto;

  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  clientId: Types.ObjectId;

  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  _id?: Types.ObjectId;

  @IsOptional()
  createdBy?: Types.ObjectId;

  @IsNotEmpty()
  @IsBoolean()
  allowIncentivize: boolean;

  @IsNotEmpty()
  @IsBoolean()
  enableAudioAid: boolean;

  @IsNotEmpty()
  @IsBoolean()
  hideActAfterCom: boolean;
}

class InnerActivity {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  ordering: number;

  @IsNotEmpty()
  @IsIn(Object.values(STATUS_PLAYED_ACTIVITY))
  status: string;
}

export class SaveOfflineCompletedChecklist {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => InnerActivity)
  activities: InnerActivity[];

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => InnerChecklist)
  checklist: Checklist;

  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  checklistId: Types.ObjectId;

  @IsIn(Object.values(INITIATOR))
  initiator: string;

  @IsIn(Object.keys(STATUS_PLAYED_CHECKLIST))
  status: string;

  @IsDateString()
  finishedAt: Date;

  @IsDateString()
  startedAt: Date;
}
