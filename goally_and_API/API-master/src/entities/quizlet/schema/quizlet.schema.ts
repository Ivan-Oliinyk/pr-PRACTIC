import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Client } from 'src/entities/clients/schema/client.schema';
import { Routine } from 'src/entities/routines/schema/routine.schema';
import { User } from 'src/entities/users/schema';
import { LIBRARY_TYPES } from 'src/shared/const';
import { QUIZLET_CORRECT_TYPE } from 'src/shared/const/quizlet-correct-type';
import { QUIZLET_TYPES } from 'src/shared/const/quizlet-types';

export class Answer {
  correct: boolean;
  text: string;
  imgURL: string;
  _id?: Types.ObjectId;
}

@Schema({ timestamps: true })
export class Quizlet extends Document {
  @Prop({ required: true })
  question: string;

  @Prop({
    required: true,
    default: [],
    type: [{ correct: Boolean, text: String, imgURL: String }],
  })
  answers: Answer[];

  @Prop({ enum: Object.values(QUIZLET_CORRECT_TYPE) })
  isCorrectType: string;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
  })
  createdBy: User;

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

  @Prop({
    type: Date,
    default: null,
  })
  lastCompleted: Date;

  @Prop({})
  ordering: number;

  @Prop({
    type: [Types.ObjectId],
    ref: Routine.name,
    default: [],
  })
  assignedRoutines: Types.ObjectId[];

  @Prop({
    type: Types.ObjectId,
    ref: Quizlet.name,
    default: null,
  })
  parentQuizId: Quizlet;

  @Prop({ default: false })
  migrated: boolean;

  createdAt: Date;

  @Prop({ enum: Object.values(QUIZLET_TYPES) })
  type: string;
}
const QuizletSchema = SchemaFactory.createForClass(Quizlet);

export { QuizletSchema };
