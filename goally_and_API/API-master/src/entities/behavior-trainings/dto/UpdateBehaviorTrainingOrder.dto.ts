import { Transform, Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Types } from 'mongoose';
import { IsMongoIdObj, TransformStringToObjectId } from 'src/shared/validation';

export class BehaviorTrainingOrderDto {
  @IsNotEmpty()
  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  _id: Types.ObjectId;

  @IsNotEmpty()
  @IsNumber()
  ordering: number;
}
export class UpdateBehaviorTrainingOrdersDto {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => BehaviorTrainingOrderDto)
  behaviorTrainings: BehaviorTrainingOrderDto[];
}
