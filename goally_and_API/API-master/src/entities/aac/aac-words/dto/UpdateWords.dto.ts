import { Transform, Type } from 'class-transformer';
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { Types } from 'mongoose';
import { IsMongoIdObj, TransformStringToObjectId } from 'src/shared/validation';

export class UpdateWordDto {
  @IsNotEmpty()
  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  _id: Types.ObjectId;
}

export class UpdateWordsDto {
  @IsNotEmpty()
  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  childFolderId: Types.ObjectId;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateWordDto)
  templateWordsIds: UpdateWordDto[];
}
