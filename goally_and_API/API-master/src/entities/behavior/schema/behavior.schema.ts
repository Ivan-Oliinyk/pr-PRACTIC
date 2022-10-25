import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Client } from 'src/entities/clients/schema/client.schema';
import { User } from 'src/entities/users/schema';
import { LIBRARY_TYPES } from 'src/shared/const';

@Schema({ timestamps: true })
export class Behavior extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  points: number;

  @Prop({ required: true })
  showOnDevice: boolean;

  @Prop({
    enum: [LIBRARY_TYPES.ADULT, LIBRARY_TYPES.CHILD],
    required: true,
  })
  libraryType: string;

  @Prop({})
  ordering: number;

  @Prop({
    type: Types.ObjectId,
    ref: Client.name,
    default: null,
  })
  clientId: Types.ObjectId;

  @Prop({ default: false })
  migrated: boolean;

  @Prop({
    type: Types.ObjectId,
    ref: Behavior.name,
    default: null,
  })
  parentBehaviorId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
  })
  createdBy: User;

  createdAt: Date;

  @Prop({})
  imgURL: string;
}
const BehaviorSchema = SchemaFactory.createForClass(Behavior);

export { BehaviorSchema };
