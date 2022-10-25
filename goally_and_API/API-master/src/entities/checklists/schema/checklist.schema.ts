import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Client } from 'src/entities/clients/schema/client.schema';
import { User } from 'src/entities/users/schema';
import { CHECKLIST_TYPE } from 'src/shared/const/checklist-type';
import { LIBRARY_TYPES } from 'src/shared/const/library-type';
import { TYPES } from 'src/shared/const/routine-type';

export class DayTime {
  Sun: string | null;
  Mon: string | null;
  Tue: string | null;
  Wed: string | null;
  Thu: string | null;
  Fri: string | null;
  Sat: string | null;
}

export class Notification {
  _id: Types.ObjectId;
  name: string;
  isActive: boolean;
  audioUrl: string;
  isReadText: boolean;
  timeBefore: number;
}
export class Activity {
  _id?: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop()
  ordering: number;
}

@Schema({ timestamps: true })
export class Checklist extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ default: 10 })
  duration: number;

  @Prop({
    enum: [CHECKLIST_TYPE.MANUAL, CHECKLIST_TYPE.SCHEDULED],
    required: true,
  })
  type: string;

  @Prop({
    type: DayTime,
  })
  schedule: DayTime;

  @Prop()
  visualAidUrl: string;

  @Prop({
    type: [{ name: String, ordering: Number }],
  })
  activities: Activity[];

  @Prop({ default: true })
  allowIncentivize: boolean;

  @Prop({ default: 100 })
  numberOfPointsOnTime: number;

  @Prop({ default: 50 })
  numberOfPointsLate: number;

  @Prop({ default: 2 })
  numberOfPuzzlesOnTime: number;

  @Prop({ default: 0 })
  numberOfPuzzlesLate: number;

  @Prop({ default: true })
  enableAudioAid: boolean;

  @Prop({ default: false })
  hideActAfterCom: boolean;

  @Prop({})
  ordering: number;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
  })
  createdBy: User;

  @Prop({
    type: Types.ObjectId,
    ref: Client.name,
  })
  clientId: Types.ObjectId;

  @Prop({
    enum: [LIBRARY_TYPES.ADULT, LIBRARY_TYPES.CHILD],
    required: true,
  })
  libraryType: string;

  @Prop({ type: [Types.ObjectId], ref: 'Device' })
  devices: Types.ObjectId[];

  @Prop({
    type: [
      {
        name: String,
        isActive: Boolean,
        audioUrl: String,
        isReadText: Boolean,
        timeBefore: Number,
      },
    ],
  })
  checklistNotifications: Notification[];

  @Prop({ default: TYPES.CHECKLIST.toUpperCase() })
  entityType: string;

  @Prop({})
  ctaOrdering: number;

  @Prop({ default: true })
  showOnLearnerApp: boolean;

  @Prop({ default: true })
  enableEmotionalFeedback: boolean;
}
const ChecklistSchema = SchemaFactory.createForClass(Checklist);

export { ChecklistSchema };
