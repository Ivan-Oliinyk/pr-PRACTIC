import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Client } from 'src/entities/clients/schema/client.schema';
import { SleepMode } from 'src/entities/sleep-mode/schema/sleep-mode.schema';
import { INITIATOR, STATUS_PLAYED_SLEEP_MODE } from '../const';

export class DayTime {
  Sun: string | null;
  Mon: string | null;
  Tue: string | null;
  Wed: string | null;
  Thu: string | null;
  Fri: string | null;
  Sat: string | null;
}
export class InnerSleepMode {
  clientId: Types.ObjectId;
  schedule: DayTime;
  duration: number;
  audioType: string;
  audioUrl: string;
  audioDuration: number;
  videoUrl: string;
  videoDuration: number;
  asleepColor: string;
  backtoBedColor: string;
  backtoBedDuration: number;
  isWakeUpCelebration: boolean;
  wakeUpVideo: string;
  soundVolume: number;
  screenBrightness: number;
  createdBy: Types.ObjectId;
  thumbnailUrl: string;
  startAfterNightRoutine: boolean;
}
@Schema({ timestamps: true })
export class CompletedSleepMode extends Document {
  @Prop({
    type: Types.ObjectId,
    ref: SleepMode.name,
    default: null,
  })
  sleepModeId: Types.ObjectId;

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

  @Prop({ enum: Object.values(STATUS_PLAYED_SLEEP_MODE) })
  status: string;

  @Prop({
    type: Date,
  })
  finishedAt: Date;

  @Prop({ type: InnerSleepMode })
  sleepMode: Partial<InnerSleepMode>;

  @Prop({ default: false })
  offlinePlayed: boolean;

  @Prop({
    type: Types.ObjectId,
    ref: 'Device',
  })
  playedDevice: Types.ObjectId;
}
const CompletedSleepModeSchema = SchemaFactory.createForClass(
  CompletedSleepMode,
);
export { CompletedSleepModeSchema };
