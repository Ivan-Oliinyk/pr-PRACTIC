import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Types } from 'mongoose';
import { LIBRARY_TYPES } from 'src/shared/const';
import { IsMongoIdObj, TransformStringToObjectId } from 'src/shared/validation';

export class CreateReward {
  @IsString()
  name: string;

  @IsInt()
  @Min(0)
  points: number;

  @IsBoolean()
  showOnDevice: boolean;

  @IsBoolean()
  allowRedeem: boolean;

  @IsString()
  imgURL: string;

  @IsIn([LIBRARY_TYPES.ADULT, LIBRARY_TYPES.CHILD])
  libraryType: string;

  @IsOptional()
  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  clientId: Types.ObjectId;

  @IsOptional()
  assetSetting: boolean;

  @Min(0)
  @IsOptional()
  @IsNumber()
  ordering: number;

  @IsOptional()
  @IsBoolean()
  isVisibleToAudience: boolean;
}
