import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { Types } from 'mongoose';
import { IsMongoIdObj, TransformStringToObjectId } from 'src/shared/validation';

export class CreatePlayedRoutine {
  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  routineId: Types.ObjectId;
}

export class CreatePlayedRoutineRequest {
  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  routineId: Types.ObjectId;

  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  clientId: Types.ObjectId;

  @IsOptional()
  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  deviceId: Types.ObjectId;
}

export class PlayOrPauseActivityDto {
  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  activityId: Types.ObjectId;
}

export class UpdatePlayedRoutineWebPortal {
  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  routineId: Types.ObjectId;

  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  clientId: Types.ObjectId;

  @IsOptional()
  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  deviceId: Types.ObjectId;
}

export class UpdatePlayedRoutineActivityWebPortal {
  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  routineId: Types.ObjectId;

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
