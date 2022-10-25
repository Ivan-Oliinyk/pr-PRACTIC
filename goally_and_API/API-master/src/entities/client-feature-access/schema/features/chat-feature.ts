import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false, id: false })
export class ChatFeature extends Document {
  @Prop()
  teamChatChannels: boolean;
  @Prop()
  includePictureAttachments: boolean;
  @Prop()
  readReceipts: boolean;
  @Prop()
  oneWayAudioCalls: boolean;
  @Prop()
  oneWayVideoCalls: boolean;
  @Prop()
  streamlinedTeacherHandoffs: boolean;
}
export const ChatFeatureSchema = SchemaFactory.createForClass(ChatFeature);
