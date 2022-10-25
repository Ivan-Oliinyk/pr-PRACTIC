import { Transform } from 'class-transformer';
import { IsMongoId, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { IsMongoIdObj, TransformStringToObjectId } from 'src/shared/validation';
export class ReorderReward {
  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  rewardId: Types.ObjectId;

  @IsString()
  action: string;
}
