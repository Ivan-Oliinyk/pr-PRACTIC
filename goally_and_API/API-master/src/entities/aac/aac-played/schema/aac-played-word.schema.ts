import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Client } from 'src/entities/clients/schema/client.schema';
import { User } from 'src/entities/users/schema';
import { LIBRARY_TYPES } from 'src/shared/const';
import { AAC_TEXT_TYPES } from 'src/shared/const/aac-text-types';
import { AAC_VISUAL_AID_TYPES } from 'src/shared/const/aac-visual-aids';
import { AacFolder } from '../../aac-folders/schema/aac-folder.schema';

@Schema({ timestamps: true })
export class AacPlayedWord extends Document {
  @Prop({ required: true })
  grouping: number;

  @Prop({ required: true })
  alphabet: string;

  @Prop({ required: true })
  serial: number;

  @Prop({ required: true })
  subSerial: number;

  @Prop({ required: true })
  displayId: string;

  @Prop({ required: true })
  partOfSpeech: string;

  @Prop({ required: true })
  color: string;

  @Prop({ required: true })
  folderDisplayId: number;

  @Prop({ required: true })
  parentFolderDisplayId: number;

  @Prop({ type: Types.ObjectId, ref: AacFolder.name, required: true })
  folderId: Types.ObjectId;

  @Prop({ required: true })
  label: string;

  @Prop({ required: true })
  text: string;

  @Prop()
  visualAid: string;

  @Prop({
    enum: [LIBRARY_TYPES.ADULT, LIBRARY_TYPES.CHILD],
    required: true,
  })
  libraryType: string;

  @Prop({
    type: Types.ObjectId,
    ref: Client.name,
  })
  clientId: Types.ObjectId;

  @Prop({ default: false })
  isDictionary: boolean;

  @Prop({
    enum: [
      AAC_VISUAL_AID_TYPES.TEXT,
      AAC_VISUAL_AID_TYPES.IMAGE,
      AAC_VISUAL_AID_TYPES.EMOJI,
    ],
    required: true,
  })
  visualAidType: string;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
  })
  createdBy: User;

  @Prop()
  isCustomVoice: boolean;

  @Prop()
  mp3Url: string;

  @Prop()
  pinOrder: number;

  @Prop({ type: Date })
  hiddenUntil: Date;

  @Prop({
    enum: [AAC_TEXT_TYPES.WORD, AAC_TEXT_TYPES.PHRASE],
    required: true,
  })
  textType: string;

  @Prop()
  gridPosition: number;
}
const AacPlayedWordSchema = SchemaFactory.createForClass(AacPlayedWord);

export { AacPlayedWordSchema };
