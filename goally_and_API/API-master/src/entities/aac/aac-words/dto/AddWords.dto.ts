import { Transform, Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { Types } from 'mongoose';
import { IsMongoIdObj, TransformStringToObjectId } from 'src/shared/validation';

export class AddWordDto {
  @IsNotEmpty()
  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  _id: Types.ObjectId;
}

export class AddWordsDto {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => AddWordDto)
  words: AddWordDto[];
}
