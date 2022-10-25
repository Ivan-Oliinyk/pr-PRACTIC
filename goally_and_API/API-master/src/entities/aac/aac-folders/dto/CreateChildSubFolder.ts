import { Transform } from 'class-transformer';
import { Types } from 'mongoose';
import { IsMongoIdObj, TransformStringToObjectId } from 'src/shared/validation';

export class CreateChildSubFolder {
  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  clientId: Types.ObjectId;

  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  subFolderId: Types.ObjectId;
}
