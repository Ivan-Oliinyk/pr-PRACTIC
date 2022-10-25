import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Images extends Document {
  @Prop({})
  name: string;

  @Prop()
  category: string;

  @Prop({ default: [] })
  tags: string[];

  @Prop()
  aidType: string;
}
const ImagesSchema = SchemaFactory.createForClass(Images);

export { ImagesSchema };
