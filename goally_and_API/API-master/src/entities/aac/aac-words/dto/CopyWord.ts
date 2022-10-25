import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';
import { IsMongoIdObj, TransformStringToObjectId } from 'src/shared/validation';

export class CopyWord {
  @IsNotEmpty()
  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  wordId: Types.ObjectId;

  @IsNotEmpty()
  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  folderId: Types.ObjectId;
}
