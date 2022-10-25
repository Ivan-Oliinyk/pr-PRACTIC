import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false, id: false })
export class BstFeature extends Document {
  @Prop()
  customSocialStoryCreation: boolean;
  @Prop()
  gamifiedFeedback: boolean;
  @Prop()
  scriptRehearsalsForHome: boolean;
}
export const BstFeatureSchema = SchemaFactory.createForClass(BstFeature);
