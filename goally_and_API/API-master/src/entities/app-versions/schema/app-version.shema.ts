import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class AppVersion extends Document {
  @Prop({})
  version: number;

  @Prop()
  url: string;

  @Prop()
  appId: string;

  @Prop({ default: false })
  isForMigrated: boolean;

  @Prop({ default: false })
  isNotForPublic: boolean;

  createdAt: Date;
}
const AppVersionSchema = SchemaFactory.createForClass(AppVersion);

export { AppVersionSchema };
