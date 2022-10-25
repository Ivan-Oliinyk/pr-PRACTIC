import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsIn,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Types } from 'mongoose';
import { LIBRARY_TYPES } from 'src/shared/const';
import { QUIZLET_CORRECT_TYPE } from 'src/shared/const/';
import { QUIZLET_TYPES } from 'src/shared/const/quizlet-types';
import { Answer, MAX_ANSWERS } from './AnswerDto';

export class CreateQuizlet {
  @IsString()
  question: string;

  @IsIn([LIBRARY_TYPES.ADULT, LIBRARY_TYPES.CHILD])
  libraryType: string;

  @IsIn(Object.values(QUIZLET_CORRECT_TYPE))
  isCorrectType: string;

  @IsArray()
  @ArrayMinSize(MAX_ANSWERS)
  @ArrayMaxSize(MAX_ANSWERS)
  @ValidateNested({ each: true })
  @Type(() => Answer)
  answers: Answer[];

  @IsOptional()
  @IsMongoId()
  clientId: Types.ObjectId;

  @IsArray()
  assignedRoutines: Types.ObjectId[];

  @Min(0)
  @IsOptional()
  @IsNumber()
  ordering: number;

  @IsOptional()
  @IsIn(Object.values(QUIZLET_TYPES))
  type: string;
}
