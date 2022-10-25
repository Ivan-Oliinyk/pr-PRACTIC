import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Client } from 'src/entities/clients/schema/client.schema';

export class Time {
  startedAt: string;
  endedAt: string;
}
export class SoundSchedule {
  Sun: Time;
  Mon: Time;
  Tue: Time;
  Wed: Time;
  Thu: Time;
  Fri: Time;
  Sat: Time;
}
export class Audio {
  @Prop({ default: false })
  isSelected: boolean;
  name: string;
  url: string;
}

export class SoundType {
  event: string;
  volume: number;
  audioList: Audio[];
}

export class GeneralSoundType {
  enableSoundSettings: boolean;
  allowAdjustVolume: boolean;
  allowChangeSound: boolean;
  voiceId: string;
  volume: number;
  enableReduceVolume: boolean;
  reduceVolumeBy: number;
  schedule: SoundSchedule;
  masterVolume: number;
  vibrateOnClick: boolean;
}

@Schema({ timestamps: true })
export class Sound extends Document {
  @Prop({
    required: true,
    type: Types.ObjectId,
    unique: true,
    ref: Client.name,
  })
  clientId: Types.ObjectId;

  @Prop({
    required: true,
    default: [],
    type: [
      {
        event: String,
        volume: Number,
        audioList: [{ isSelected: Boolean, name: String, url: String }],
      },
    ],
  })
  general: SoundType[];

  @Prop({
    required: true,
    default: {
      enableSoundSettings: true,
      allowAdjustVolume: true,
      allowChangeSound: true,
      voiceId: 'Matthew',
      volume: 100,
      enableReduceVolume: false,
      reduceVolumeBy: 0,
      schedule: null,
      masterVolume: 100,
      vibrateOnClick: false,
    },
    type: {
      enableSoundSettings: Boolean,
      allowAdjustVolume: Boolean,
      allowChangeSound: Boolean,
      voiceId: String,
      volume: Number,
      enableReduceVolume: Boolean,
      reduceVolumeBy: Number,
      schedule: {
        Sun: { startedAt: String, endedAt: String },
        Mon: { startedAt: String, endedAt: String },
        Tue: { startedAt: String, endedAt: String },
        Wed: { startedAt: String, endedAt: String },
        Thu: { startedAt: String, endedAt: String },
        Fri: { startedAt: String, endedAt: String },
        Sat: { startedAt: String, endedAt: String },
      },
      masterVolume: Number,
      vibrateOnClick: Boolean,
    },
  })
  generalNew: GeneralSoundType;

  @Prop({
    required: true,
    default: [],
    type: [
      {
        event: String,
        volume: Number,
        audioList: [{ isSelected: Boolean, name: String, url: String }],
      },
    ],
  })
  visualScdedule: SoundType[];

  @Prop({
    required: true,
    default: [],
    type: [
      {
        event: String,
        volume: Number,
        audioList: [{ isSelected: Boolean, name: String, url: String }],
      },
    ],
  })
  puzzle: SoundType[];

  @Prop({
    required: true,
    default: [],
    type: [
      {
        event: String,
        volume: Number,
        audioList: [{ isSelected: Boolean, name: String, url: String }],
      },
    ],
  })
  timer: SoundType[];

  @Prop({
    required: true,
    default: [],
    type: [
      {
        event: String,
        volume: Number,
        audioList: [{ isSelected: Boolean, name: String, url: String }],
      },
    ],
  })
  reward: SoundType[];

  @Prop({
    required: true,
    default: [],
    type: [
      {
        event: String,
        volume: Number,
        audioList: [{ isSelected: Boolean, name: String, url: String }],
      },
    ],
  })
  behavior: SoundType[];
}

const SoundSchema = SchemaFactory.createForClass(Sound);

export { SoundSchema };
