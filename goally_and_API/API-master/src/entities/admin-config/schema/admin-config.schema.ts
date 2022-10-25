import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class DeviceVideo {
  _id?: Types.ObjectId;
  appName: string;
  fileSize: number;
  url: string;
  updatedAt: Date;
}
export class CareGiverTile {
  _id?: Types.ObjectId;
  headline: string;
  url: string;
  description: string;
  category: string;
  detailUrl: string;
  appearAfterDays: number;
  detailsDescription: string;
  position: number;
  updatedAt: Date;
}
export class SleepAid {
  _id?: Types.ObjectId;
  audioName: string;
  audioUrl: string;
  videos?: {
    fileSize: number;
    videoName: string;
    videoUrl: string;
    thumbnailUrl: string;
    videoUserCount?: number;
  }[];

  soundUserCount?: number;
}

@Schema({ timestamps: true })
export class AdminConfig extends Document {
  @Prop({
    required: true,
    default: [],
    type: [{ appName: String, fileSize: Number, url: String, updatedAt: Date }],
  })
  deviceVideos: DeviceVideo[];

  @Prop({
    required: true,
    default: [],
    type: [
      {
        headline: String,
        url: String,
        description: String,
        detailsDescription: String,
        category: String,
        detailUrl: String,
        appearAfterDays: Number,
        position: Number,
        updatedAt: Date,
      },
    ],
  })
  careGiverTiles: CareGiverTile[];

  @Prop({
    required: true,
    default: [],
    type: [
      {
        audioName: String,
        audioUrl: String,
        videos: [
          {
            fileSize: Number,
            videoName: String,
            videoUrl: String,
            thumbnailUrl: String,
          },
        ],
      },
    ],
  })
  sleepAids: SleepAid[];
}
const AdminConfigSchema = SchemaFactory.createForClass(AdminConfig);

export { AdminConfigSchema };
