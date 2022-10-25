import { Transform } from 'class-transformer';
import { Types } from 'mongoose';
import { IsMongoIdObj, TransformStringToObjectId } from 'src/shared/validation';

export class ChildAacPlayedWord {
  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  wordId: Types.ObjectId;
}
