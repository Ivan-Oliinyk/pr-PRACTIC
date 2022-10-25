import { Transform } from 'class-transformer';
import { Types } from 'mongoose';
import { IsMongoIdObj, TransformStringToObjectId } from 'src/shared/validation';

export class CreateCompletedSleepMode {
  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  sleepModeId: Types.ObjectId;
}

export class CreateCompletedSleepModeRequest {
  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  sleepModeId: Types.ObjectId;

  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  clientId: Types.ObjectId;

  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  deviceId: Types.ObjectId;
}
