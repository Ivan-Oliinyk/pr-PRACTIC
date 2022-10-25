import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Client } from 'src/entities/clients/schema/client.schema';
import { User } from 'src/entities/users/schema';
import { LIBRARY_TYPES } from 'src/shared/const/library-type';
import { REMINDER_TYPE } from 'src/shared/const/reminder-type';
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
  minutesBefore: number;

  isReadReminderSoundEnabled: boolean;

  isPositiveReinfoSoundEnabled: boolean;
  positiveReinfoSoundUrl: string | null;

  isNotificationSoundEnabled: boolean;
  notificationSoundUrl: string | null;
}

@Schema({ timestamps: true })
export class Reminder extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({
    type: DayTime,
  })
  schedule: DayTime;

  @Prop({ required: true })
  duration: number;

  @Prop()
  visualAidUrl: string;

  @Prop({
    required: true,
    default: [],
    type: [
      {
        minutesBefore: Number,
        isReadReminderSoundEnabled: Boolean,
        isPositiveReinfoSoundEnabled: Boolean,
        positiveReinfoSoundUrl: String,
        isNotificationSoundEnabled: Boolean,
        notificationSoundUrl: String,
      },
    ],
  })
  notifications: Notification[];

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

  @Prop()
  ordering: number;

  @Prop({
    enum: [LIBRARY_TYPES.ADULT, LIBRARY_TYPES.CHILD],
    required: true,
  })
  libraryType: string;

  @Prop({ type: [Types.ObjectId], ref: 'Device' })
  devices: Types.ObjectId[];

  @Prop({ default: TYPES.REMINDER.toUpperCase() })
  entityType: string;

  @Prop({})
  ctaOrdering: number;

  @Prop({
    enum: [REMINDER_TYPE.MANUAL, REMINDER_TYPE.SCHEDULED],
    default: REMINDER_TYPE.SCHEDULED,
  })
  type: string;
}
const ReminderSchema = SchemaFactory.createForClass(Reminder);

export { ReminderSchema };
