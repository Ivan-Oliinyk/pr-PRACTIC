import { Transform } from 'class-transformer';
import { IsMongoId } from 'class-validator';
import { Types } from 'mongoose';
import { IsMongoIdObj, TransformStringToObjectId } from 'src/shared/validation';

export class ChildRedeemReward {
  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  rewardId: Types.ObjectId;
}
