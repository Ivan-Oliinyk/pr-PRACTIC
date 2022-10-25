import { Transform, Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  Min,
  ValidateNested,
} from 'class-validator';
import { Types } from 'mongoose';
import { IsMongoIdObj, IsUniqArrayOfIds, TransformStringToObjectId } from 'src/shared/validation';

export class RoutineOrderDto {

  @IsNotEmpty()
  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  _id: Types.ObjectId;

  @IsNotEmpty()
  @IsNumber()
  ordering: number;
}
export class UpdateRoutineOrdersDto {

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => RoutineOrderDto)
  routines: RoutineOrderDto[];
}
