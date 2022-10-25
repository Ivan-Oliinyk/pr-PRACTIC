import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Client } from 'src/entities/clients/schema/client.schema';
import { User } from 'src/entities/users/schema/user.schema';

export class DayTime {
  Sun: string | null;
  Mon: string | null;
  Tue: string | null;
  Wed: string | null;
  Thu: string | null;
  Fri: string | null;
  Sat: string | null;
}
@Schema({ timestamps: true })
export class SleepMode extends Document {
  @Prop({
    required: true,
    type: Types.ObjectId,
    unique: true,
    ref: Client.name,
  })
  clientId: Types.ObjectId;

  @Prop({
    required: true,
    type: DayTime,
  })
  schedule: DayTime;

  @Prop()
  duration: number;

  @Prop()
  audioType: string;

  @Prop()
  audioUrl: string;

  @Prop()
  audioDuration: number;

  @Prop()
  videoUrl: string;

  @Prop()
  videoDuration: number;

  @Prop()
  asleepColor: string;

  @Prop()
  backtoBedColor: string;

  @Prop()
  backtoBedDuration: number;

  @Prop()
  isWakeUpCelebration: boolean;

  @Prop()
  wakeUpVideo: string;

  @Prop()
  soundVolume: number;

  @Prop()
  screenBrightness: number;

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: User.name,
  })
  createdBy: Types.ObjectId;

  @Prop()
  thumbnailUrl: string;

  @Prop({ default: true })
  startAfterNightRoutine: boolean;
}

const SleepModeSchema = SchemaFactory.createForClass(SleepMode);

export { SleepModeSchema };
