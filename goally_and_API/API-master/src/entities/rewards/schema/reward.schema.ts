import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Client } from 'src/entities/clients/schema/client.schema';
import { User } from 'src/entities/users/schema';
import { LIBRARY_TYPES } from 'src/shared/const';

@Schema({ timestamps: true })
export class Reward extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  points: number;

  @Prop({ required: true, default: true })
  showOnDevice: boolean;

  @Prop({ required: true, default: true })
  allowRedeem: boolean;

  @Prop({})
  imgURL: string;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
  })
  createdBy: User;

  @Prop({
    enum: [LIBRARY_TYPES.ADULT, LIBRARY_TYPES.CHILD, LIBRARY_TYPES.GLOBAL],
    required: true,
  })
  libraryType: string;

  @Prop({})
  ordering: number;

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
  parentRewardId: Reward;
  @Prop({ default: false })
  migrated: boolean;

  createdAt: Date;

  @Prop({ default: false })
  isVisibleToAudience: boolean;

  @Prop({ default: false })
  isMarkedHot: boolean;

  @Prop({ default: false })
  addOnUserCreation: boolean;

  @Prop({ default: false })
  addOnClientCreation: boolean;
}
const RewardSchema = SchemaFactory.createForClass(Reward);

export { RewardSchema };
