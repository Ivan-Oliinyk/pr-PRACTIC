import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Client } from 'src/entities/clients/schema/client.schema';
import { Answer } from 'src/entities/quizlet/dto/AnswerDto';
import { Quizlet } from 'src/entities/quizlet/schema/quizlet.schema';
import { User } from 'src/entities/users/schema';
import { QUIZLET_CORRECT_TYPE } from 'src/shared/const';
import * as mongoosePaginate from 'mongoose-paginate-v2';
@Schema({ timestamps: true })
export class CompletedQuizlet extends Document {
  @Prop({ required: true })
  question: string;

  @Prop({
    required: true,
    default: [],
    type: [{ correct: Boolean, text: String, imageUrl: String }],
  })
  answers: Answer[];

  @Prop({
    required: true,
    type: [Types.ObjectId],
  })
  clientAnswers: Types.ObjectId[];

  @Prop({ enum: Object.values(QUIZLET_CORRECT_TYPE) })
  isCorrectType: string;

  @Prop({ default: false })
  isCorrect: boolean;

  @Prop({
    type: Types.ObjectId,
    ref: Client.name,
    default: null,
  })
  clientId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: Quizlet.name,
    default: null,
  })
  quizletId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
  })
  createdBy: User;

  @Prop({ default: false })
  migrated: boolean;

  createdAt: Date;
}
const CompletedQuizletSchema = SchemaFactory.createForClass(CompletedQuizlet);

CompletedQuizletSchema.plugin(mongoosePaginate);

export { CompletedQuizletSchema };
