import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { Types } from 'mongoose';
import { IsMongoIdObj, TransformStringToObjectId } from 'src/shared/validation';

export class CreateCompletedChecklist {
  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  checklistId: Types.ObjectId;
}

export class CreateCompletedChecklistRequest {
  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  checklistId: Types.ObjectId;

  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  clientId: Types.ObjectId;

  @IsOptional()
  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  deviceId: Types.ObjectId;
}

export class UpdateCompletedChecklistActivityWebPortal {
  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  checklistId: Types.ObjectId;

  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  clientId: Types.ObjectId;

  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  activityId: Types.ObjectId;

  @IsOptional()
  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  deviceId: Types.ObjectId;
}
