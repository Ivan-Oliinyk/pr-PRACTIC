import { Transform, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Types } from 'mongoose';
import { IsMongoIdObj, TransformStringToObjectId } from 'src/shared/validation';

export class Rehearsal {
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  timeOnModelingInMin: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  timeOnRehearsInMin: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  timeOnFeedbackInMin: number;

  @IsOptional()
  @IsString()
  correctlyCompletedAttr: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  timeOnInstructInMin: number;
}

export class Segment {
  @IsNotEmpty()
  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  segmentId: Types.ObjectId;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  freqOfRehears: number;

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => Rehearsal)
  rehearsals: Rehearsal[];
}

export class ChildCompleteRehearsalTraining {
  @IsNotEmpty()
  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  behaviorTrainingId: Types.ObjectId;

  @IsNotEmpty()
  @IsDateString()
  startedAt: Date;

  @IsNotEmpty()
  @IsString()
  bstType: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  totalTimeToCompleteInMin: number;

  @IsNotEmpty()
  @IsBoolean()
  pointsGiven: boolean;

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => Segment)
  segments: Segment[];
}
