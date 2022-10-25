import { Transform, Type } from 'class-transformer';
import {
  IsIn,
  IsNotEmpty,
  IsNotEmptyObject,
  ValidateNested,
} from 'class-validator';
import { Types } from 'mongoose';
import { TYPES } from 'src/shared/const/routine-type';
import { IsMongoIdObj, TransformStringToObjectId } from 'src/shared/validation';
export class MovingEntityDto {
  @IsNotEmpty()
  @IsIn(Object.values(TYPES))
  name: string;

  @IsNotEmpty()
  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  id: Types.ObjectId;
}
export class UpdateCtaOrderingDto {
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => MovingEntityDto)
  from: MovingEntityDto;

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => MovingEntityDto)
  to: MovingEntityDto;
}
