import { Transform } from 'class-transformer';
import { IsIn, IsMongoId, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { REORDERING_ACTION } from 'src/shared/const/reordering.action';
import { IsMongoIdObj, TransformStringToObjectId } from 'src/shared/validation';

export class ReorderRoutineDto {
  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  routineId: Types.ObjectId;

  @IsString()
  @IsIn(Object.values(REORDERING_ACTION))
  action: string;
}
