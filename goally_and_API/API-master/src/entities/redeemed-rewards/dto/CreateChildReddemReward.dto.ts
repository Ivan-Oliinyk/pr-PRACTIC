import { Transform } from 'class-transformer';
import { IsMongoId } from 'class-validator';
import { Types } from 'mongoose';
import { IsMongoIdObj, TransformStringToObjectId } from 'src/shared/validation';

export class CreateRedeemReward {
  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  rewardId: Types.ObjectId;

  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  clientId: Types.ObjectId;
}
