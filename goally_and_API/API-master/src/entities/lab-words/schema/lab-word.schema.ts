import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Client } from 'src/entities/clients/schema/client.schema';

@Schema({ timestamps: true })
export class LabWord extends Document {
  @Prop()
  name: string;

  @Prop()
  imgUrl: string;

  @Prop()
  bgImgUrl: string;

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: Client.name,
  })
  clientId: Types.ObjectId;

  @Prop()
  ordering: number;

  @Prop()
  video1: string;

  @Prop()
  video2: string;

  @Prop()
  video3: string;

  @Prop()
  video4: string;

  @Prop()
  video5: string;

  @Prop()
  video6: string;
}

const LabWordSchema = SchemaFactory.createForClass(LabWord);

export { LabWordSchema };
