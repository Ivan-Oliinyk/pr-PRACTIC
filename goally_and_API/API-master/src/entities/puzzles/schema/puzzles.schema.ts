import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Client } from 'src/entities/clients/schema/client.schema';

@Schema({ timestamps: true })
export class Puzzles extends Document {
  @Prop({ trim: true, lowercase: true })
  name: string;

  @Prop({ required: true, trim: true, lowercase: true })
  category: string;

  @Prop()
  puzzleUrl: string;

  @Prop({ required: true })
  categoryUrl: string;

  @Prop({
    type: Types.ObjectId,
    ref: Client.name,
    required: true,
    default: null,
  })
  clientId: Types.ObjectId;

  @Prop({ default: false })
  isHidden: boolean;

  @Prop({ default: true })
  isPuzzleCreatedByUser: boolean;

  @Prop({ default: true })
  isCategoryCreatedByUser: boolean;

  @Prop({ default: false })
  isCompleted: boolean;

  @Prop({
    type: Date,
    default: null,
  })
  lastCompleted: Date;

  @Prop({ default: [] })
  completedPieces: number[];

  numberOfPuzzles: number;
  completedPuzzles: number;
}
const PuzzlesSchema = SchemaFactory.createForClass(Puzzles);

export { PuzzlesSchema };
