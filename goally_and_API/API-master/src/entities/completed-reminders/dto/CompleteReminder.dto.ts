import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { Types } from 'mongoose';
import { IsMongoIdObj, TransformStringToObjectId } from 'src/shared/validation';

export class CompleteReminderDto {
  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  reminderId: Types.ObjectId;
}

export class CreateCompletedReminderRequest {
  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  reminderId: Types.ObjectId;

  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  clientId: Types.ObjectId;

  @IsOptional()
  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  deviceId: Types.ObjectId;
}
