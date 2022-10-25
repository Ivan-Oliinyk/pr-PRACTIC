import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Client } from 'src/entities/clients/schema/client.schema';
import { Reward } from 'src/entities/rewards/schema/reward.schema';
import { User } from 'src/entities/users/schema';
import * as mongoosePaginate from 'mongoose-paginate-v2';
@Schema({ timestamps: true })
export class RedeemedReward extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  usedPoints: number;

  @Prop()
  imgURL: string;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
  })
  createdBy: User;

  @Prop()
  awardedBy: string;

  @Prop({
    type: Types.ObjectId,
    ref: Client.name,
  })
  clientId: Types.ObjectId;
  @Prop({
    type: Types.ObjectId,
    ref: Reward.name,
    default: null,
  })
  rewardId: Reward;
  @Prop({ default: false })
  migrated: boolean;

  createdAt: Date;
}
const RedeemedRewardSchema = SchemaFactory.createForClass(RedeemedReward);
RedeemedRewardSchema.plugin(mongoosePaginate);
export { RedeemedRewardSchema };
