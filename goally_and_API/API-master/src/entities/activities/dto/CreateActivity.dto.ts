import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Types } from 'mongoose';
import { LIBRARY_TYPES } from 'src/shared/const';
import { AUDIO_TYPES } from 'src/shared/const/routine-type';
import {
  GreaterOrEqualThen,
  IsMongoIdObj,
  TransformStringToObjectId,
} from 'src/shared/validation';

export class CreateActivityDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsIn(Object.values(AUDIO_TYPES))
  audioType: string;

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

  @IsOptional()
  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  parentActivityId?: Types.ObjectId;

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

  @IsIn([LIBRARY_TYPES.ADULT, LIBRARY_TYPES.CHILD, LIBRARY_TYPES.GLOBAL])
  libraryType: string;

  @IsOptional()
  _id?: Types.ObjectId;

  @IsOptional()
  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  createdBy?: Types.ObjectId;

  @IsOptional()
  assetSetting?: boolean;

  @IsOptional()
  @IsBoolean()
  autoComplete: boolean;
}
