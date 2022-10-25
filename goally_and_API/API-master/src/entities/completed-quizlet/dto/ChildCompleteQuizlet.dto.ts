import { Transform } from 'class-transformer';
import { IsArray, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';
import { IsMongoIdObj, TransformStringToObjectId } from 'src/shared/validation';

export class ChildCompleteQuizlet {
  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  quizletId: Types.ObjectId;

  @IsArray()
  clientAnswers: Types.ObjectId[];
}
