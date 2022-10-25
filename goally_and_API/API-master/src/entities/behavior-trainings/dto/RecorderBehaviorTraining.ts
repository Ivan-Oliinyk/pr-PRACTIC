import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';
import { Types } from 'mongoose';
import { IsMongoIdObj, TransformStringToObjectId } from 'src/shared/validation';

export class ReorderBehaviorTraining {
  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  behaviorTrainingId: Types.ObjectId;

  @IsString()
  action: string;
}
