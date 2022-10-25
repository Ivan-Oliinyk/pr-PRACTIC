import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { CreateActivityDto } from 'src/entities/activities/dto';
import { ActivitySchema } from 'src/entities/activities/schema/activity.schema';
import { Client } from 'src/entities/clients/schema/client.schema';
import { User } from 'src/entities/users/schema';
import { LIBRARY_TYPES } from 'src/shared/const';
import { QUIZLET_TYPES } from 'src/shared/const/quizlet-types';
import {
  ROUTINES_TYPE,
  ROUTINE_FOLDERS,
  TYPES,
} from 'src/shared/const/routine-type';

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

@Schema({ timestamps: true })
export class Routine extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ default: 100 })
  numberOfPointsOnTime: number;

  @Prop({ default: 50 })
  numberOfPointsLate: number;

  @Prop({ default: 2 })
  numberOfPuzzlesOnTime: number;

  @Prop({ default: 0 })
  numberOfPuzzlesLate: number;

  @Prop({
    enum: [ROUTINES_TYPE.MANUAL, ROUTINES_TYPE.SCHEDULED],
    required: true,
  })
  type: string;

  @Prop({
    enum: [
      ROUTINE_FOLDERS.BEHAVIOR_THERAPY,
      ROUTINE_FOLDERS.DAILY_ROUTINES,
      ROUTINE_FOLDERS.FUN,
      ROUTINE_FOLDERS.OCCUPATIONAL_THERAPY,
      ROUTINE_FOLDERS.SCHOOL,
      ROUTINE_FOLDERS.SPEECH_THERAPY,
    ],
  })
  routineFolder: string;

  @Prop({})
  imgURL: string;

  @Prop({})
  ordering: number;

  @Prop({
    type: Types.ObjectId,
    ref: Routine.name,
    default: null,
  })
  parentRoutineId: Routine;

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
    type: DayTime,
  })
  schedule: DayTime;

  @Prop({
    enum: [LIBRARY_TYPES.ADULT, LIBRARY_TYPES.CHILD, LIBRARY_TYPES.GLOBAL],
    required: true,
  })
  libraryType: string;

  @Prop({
    type: [ActivitySchema],
  })
  activities: Partial<CreateActivityDto>[];

  @Prop({ default: false })
  migrated: boolean;

  @Prop({
    default: true,
  })
  showTimer: boolean;

  @Prop({ default: true })
  allowClientToCancel: boolean;

  @Prop({ default: false })
  allowToOverride: boolean;

  @Prop({ default: true })
  showOnLearnerApp: boolean;

  createdAt: Date;

  @Prop({ type: Date })
  skipUntil: Date;

  @Prop({ default: false })
  isVisibleToAudience: boolean;

  @Prop({ default: false })
  isMarkedHot: boolean;

  @Prop({ default: false })
  addOnUserCreation: boolean;

  @Prop({ default: false })
  addOnClientCreation: boolean;

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
  routineNotifications: Notification[];

  @Prop({
    enum: [QUIZLET_TYPES.MORNING, QUIZLET_TYPES.BEDTIME, QUIZLET_TYPES.OTHER],
    default: QUIZLET_TYPES.OTHER,
  })
  category: string;

  @Prop({ default: true })
  enableEmotionalFeedback: boolean;

  @Prop({ default: TYPES.ROUTINE.toUpperCase() })
  entityType: string;

  @Prop({})
  ctaOrdering: number;

  @Prop({ default: true })
  allowIncentivize: boolean;

  @Prop({
    type: DayTime,
  })
  lastSchedule: DayTime;
}
const RoutineSchema = SchemaFactory.createForClass(Routine);

export { RoutineSchema };
