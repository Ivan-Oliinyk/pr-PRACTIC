import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Client } from 'src/entities/clients/schema/client.schema';
import { User } from 'src/entities/users/schema';

export class Answer {
  isCorrect: boolean;
  text: string;
  _id?: Types.ObjectId;
}

export class Attribute {
  name: string;
  _id?: Types.ObjectId;
}

export class Rehearsal {
  timeOnModelingInMin: number;
  timeOnRehearsInMin: number;
  timeOnFeedbackInMin: number;
  correctlyCompletedAttr: string;
  timeOnInstructInMin: number;
}

@Schema({ timestamps: true })
export class TrainingSegment extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  positiveVideoURL: string;

  @Prop()
  negativeVideoURL: string;

  @Prop({ required: true })
  question: string;

  @Prop({
    required: true,
    default: [],
    type: [{ text: String, isCorrect: Boolean }],
  })
  answers: Answer[];

  @Prop({
    required: true,
    default: [],
    type: [{ name: String }],
  })
  attributes: Attribute[];

  @Prop({
    type: Types.ObjectId,
    ref: Client.name,
  })
  clientId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
  })
  createdBy: User;

  //general behavior-training
  @Prop()
  clientAnswerId: Types.ObjectId;
  @Prop()
  isCorrectAnswer: boolean;

  //rehersal behavior-training
  @Prop()
  freqOfRehears: number;
  @Prop({
    type: [
      {
        timeOnModelingInMin: Number,
        timeOnRehearsInMin: Number,
        timeOnFeedbackInMin: Number,
        correctlyCompletedAttr: String,
        timeOnInstructInMin: Number,
      },
    ],
  })
  rehearsals: Rehearsal[];
}

const TrainingSegmentSchema = SchemaFactory.createForClass(TrainingSegment);

export { TrainingSegmentSchema };
