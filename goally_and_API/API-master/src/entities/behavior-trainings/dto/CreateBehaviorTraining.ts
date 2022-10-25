import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Types } from 'mongoose';
import { CreateTrainingSegment } from 'src/entities/behavior-trainings/training-segments/dto/CreateTrainingSegment.dto';
import { LIBRARY_TYPES } from 'src/shared/const';
import { IsMongoIdObj, TransformStringToObjectId } from 'src/shared/validation';
import { urlRegex } from 'src/shared/validation/regexp';
import { MAX_REASONS, MIN_REASONS, Reason } from './ReasonDto';

export class CreateBehaviorTraining {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsArray()
  @ArrayMinSize(MIN_REASONS)
  @ArrayMaxSize(MAX_REASONS)
  @ValidateNested({ each: true })
  @Type(() => Reason)
  reasons: Reason[];

  @IsNotEmpty()
  @IsString()
  @Matches(urlRegex, { message: 'videoURL is invalid' })
  videoURL: string;

  @IsNotEmpty()
  @IsInt()
  points: number;

  @IsNotEmpty()
  @IsInt()
  puzzlePieces: number;

  @ValidateIf(o => o.isPinRequired)
  @IsNotEmpty()
  @IsInt()
  pin: number;

  @IsOptional()
  @IsBoolean()
  isPinRequired: boolean;

  @IsOptional()
  @IsBoolean()
  puzzlePieceOnCorrectAnswer: boolean;

  @IsNotEmpty()
  @IsIn([LIBRARY_TYPES.ADULT, LIBRARY_TYPES.CHILD])
  libraryType: string;

  @IsOptional()
  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  clientId: Types.ObjectId;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateTrainingSegment)
  segments: CreateTrainingSegment[];
}
