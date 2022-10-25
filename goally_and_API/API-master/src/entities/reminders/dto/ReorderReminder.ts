import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';
import { Types } from 'mongoose';
import { IsMongoIdObj, TransformStringToObjectId } from 'src/shared/validation';
export class ReorderReminder {
  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  reminderId: Types.ObjectId;

  @IsString()
  action: string;
}
