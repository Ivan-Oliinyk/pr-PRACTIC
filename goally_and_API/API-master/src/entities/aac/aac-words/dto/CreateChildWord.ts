import { Transform } from 'class-transformer';
import { Types } from 'mongoose';
import { IsMongoIdObj, TransformStringToObjectId } from 'src/shared/validation';

export class CreateChildWord {
  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  clientId: Types.ObjectId;

  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  parentWordId: Types.ObjectId;
}
