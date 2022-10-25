import { Transform, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { Types } from 'mongoose';
import { IsMongoIdObj, TransformStringToObjectId } from 'src/shared/validation';

export class Segment {
  @IsNotEmpty()
  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  segmentId: Types.ObjectId;

  @IsNotEmpty()
  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  clientAnswerId: Types.ObjectId;
}

export class ChildCompleteGeneralTraining {
  @IsNotEmpty()
  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  behaviorTrainingId: Types.ObjectId;

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => Segment)
  segments: Segment[];
}
