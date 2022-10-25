import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import {
  Activity,
  Checklist,
} from 'src/entities/checklists/schema/checklist.schema';
import { Client } from 'src/entities/clients/schema/client.schema';
import { INITIATOR, STATUS_PLAYED_CHECKLIST } from '../const';

@Schema({ timestamps: true })
export class CompletedChecklist extends Document {
  @Prop({
    type: Types.ObjectId,
    ref: Checklist.name,
    default: null,
  })
  checklistId: Types.ObjectId;

  @Prop({
    type: Date,
  })
  startedAt: Date;

  @Prop({
    type: Types.ObjectId,
    ref: Client.name,
  })
  clientId: Types.ObjectId;

  @Prop({
    enum: [INITIATOR.CLIENT, INITIATOR.USER],
  })
  initiator: string;

  @Prop({ enum: Object.values(STATUS_PLAYED_CHECKLIST) })
  status: string;

  @Prop()
  activities: Array<Partial<Activity> & { status: string }>;

  @Prop({
    type: Date,
  })
  finishedAt: Date;

  @Prop()
  earnedPoints: number;

  @Prop()
  finishedOnTime: boolean;

  @Prop()
  totalSpentTime: number;

  @Prop({ type: Checklist })
  checklist: Partial<Checklist>;

  @Prop({ default: false })
  offlinePlayed: boolean;

  @Prop()
  earnedPuzzlePieces: number;

  @Prop({
    type: Types.ObjectId,
    ref: 'Device',
  })
  playedDevice: Types.ObjectId;
}
const CompletedChecklistSchema = SchemaFactory.createForClass(
  CompletedChecklist,
);
CompletedChecklistSchema.plugin(aggregatePaginate);
export { CompletedChecklistSchema };
