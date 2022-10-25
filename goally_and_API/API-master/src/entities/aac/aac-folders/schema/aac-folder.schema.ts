import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Client } from 'src/entities/clients/schema/client.schema';
import { User } from 'src/entities/users/schema';
import { LIBRARY_TYPES } from 'src/shared/const';

@Schema({ timestamps: true })
export class AacFolder extends Document {
  @Prop({ required: true })
  parentFolderId: number;

  @Prop()
  subFolderId: number;

  @Prop({ required: true })
  folderId: number;

  @Prop({ required: true })
  parentFolderName: string;

  @Prop()
  subFolderName: string;

  @Prop({ required: true })
  gridPosition: number;

  @Prop()
  qty: number;

  @Prop({ required: true })
  type: string;

  @Prop({ default: false })
  isDictionary: boolean;

  @Prop()
  imgUrl: string;

  @Prop({
    enum: [LIBRARY_TYPES.ADULT, LIBRARY_TYPES.CHILD],
    required: true,
  })
  libraryType: string;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
  })
  createdBy: User;

  @Prop({
    type: Types.ObjectId,
    ref: Client.name,
  })
  clientId: Types.ObjectId;

  @Prop({})
  userFolderCount: number;

  @Prop({})
  userSubFolderCount: number;

  @Prop({})
  clientCount: number;

  @Prop({ default: false })
  hasSubFolders: boolean;
}
const AacFolderSchema = SchemaFactory.createForClass(AacFolder);

export { AacFolderSchema };
