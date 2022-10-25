import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { Activity } from 'src/entities/activities/schema/activity.schema';
import { Client } from 'src/entities/clients/schema/client.schema';
import { Routine } from 'src/entities/routines/schema/routine.schema';
import { User } from 'src/entities/users/schema';
import { INITIATOR, PROMPTS_OPTIONS, STATUS_PLAYED_ROUTINE } from '../const';

@Schema({ timestamps: true })
export class PlayedRoutine extends Document {
  @Prop({
    type: Types.ObjectId,
    ref: Routine.name,
    default: null,
  })
  routineId: Types.ObjectId;

  @Prop({
    type: Date,
  })
  startedAtWebPortal: Date;

  @Prop({
    type: Date,
  })
  startedAtDevice: Date;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    default: null,
  })
  startedBy: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: Client.name,
  })
  clientId: Types.ObjectId;

  @Prop({
    enum: [INITIATOR.CLIENT, INITIATOR.USER],
  })
  initiator: string;

  @Prop({ enum: Object.values(STATUS_PLAYED_ROUTINE) })
  status: string;

  @Prop({
    default: false,
  })
  parentSaved: boolean;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    default: null,
  })
  savedBy: Types.ObjectId;

  @Prop()
  activities: Array<
    Partial<Activity> & {
      timeRanges: Array<{ startedAt: Date; finishedAt: Date }>;
      status: string;
      hasBeenPaused: boolean;
      hasBeenSkipped: boolean;
    }
  >;
  @Prop({
    type: Date,
  })
  finishedAt: Date;

  @Prop({
    enum: Object.values(PROMPTS_OPTIONS),
    default: PROMPTS_OPTIONS.NONE,
  })
  additionalPrompts: string;

  @Prop()
  indepedenceLevel: number;

  @Prop()
  maxCompletionTime: number;

  @Prop()
  earnedPoints: number;

  @Prop()
  finishedOnTime: boolean;

  @Prop()
  totalSpentTime: number;

  @Prop({ type: Routine })
  routine: Partial<Routine>;

  @Prop({ default: false, type: Boolean })
  offlinePlayed: boolean;

  @Prop({ default: false })
  migrated: boolean;

  @Prop()
  earnedPuzzlePieces: number;

  createdAt: Date;

  @Prop()
  whatWorkedWell: string;

  @Prop()
  whatNeedsImprov: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'Device',
  })
  playedDevice: Types.ObjectId;
}
const PlayedRoutineSchema = SchemaFactory.createForClass(PlayedRoutine);
PlayedRoutineSchema.plugin(aggregatePaginate);
export { PlayedRoutineSchema };
