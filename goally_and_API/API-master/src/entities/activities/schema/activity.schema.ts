import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/entities/users/schema';
import { LIBRARY_TYPES } from 'src/shared/const';

@Schema({ timestamps: true })
export class Activity extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  minCompletionTime: number;

  @Prop({ required: true })
  maxCompletionTime: number;

  @Prop({ default: null })
  audioUrl: string;

  @Prop({ required: true })
  ordering: number;

  @Prop({ default: null })
  imgURL: string;

  @Prop()
  audioType: string;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
  })
  createdBy: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: Activity.name,
    default: null,
  })
  parentActivityId: Types.ObjectId;

  @Prop({
    required: true,
  })
  allowCancelActivity: boolean;

  @Prop({
    required: true,
    default: false,
  })
  allowPauseActivity: boolean;

  @Prop({
    required: true,
    default: false,
  })
  allowPush: boolean;

  @Prop({ default: true })
  showTimer: boolean;

  @Prop({
    enum: [LIBRARY_TYPES.ADULT, LIBRARY_TYPES.CHILD, LIBRARY_TYPES.GLOBAL],
    required: true,
  })
  libraryType: string;

  @Prop({ default: false })
  migrated: boolean;

  @Prop({ default: false })
  autoComplete: boolean;

  createdAt: Date;
}
const ActivitySchema = SchemaFactory.createForClass(Activity);

export { ActivitySchema };
