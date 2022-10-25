import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsIn,
  IsMongoId,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Types } from 'mongoose';
import { LIBRARY_TYPES, QUIZLET_CORRECT_TYPE } from 'src/shared/const';
import { Answer, MAX_ANSWERS } from './AnswerDto';

export class UpdateQuizlet {
  @IsOptional()
  @IsString()
  question: string;

  @IsOptional()
  @IsIn([LIBRARY_TYPES.ADULT, LIBRARY_TYPES.CHILD])
  libraryType: string;

  @IsOptional()
  @IsMongoId()
  clientId: Types.ObjectId;

  @IsArray()
  @ArrayMinSize(MAX_ANSWERS)
  @ArrayMaxSize(MAX_ANSWERS)
  @ValidateNested({ each: true })
  @Type(() => Answer)
  answers: Answer[];

  @IsOptional()
  @ValidateIf(o => o.libraryType === LIBRARY_TYPES.CHILD)
  @IsMongoId()
  parentRewardId?: Types.ObjectId;

  @IsOptional()
  @IsIn(Object.values(QUIZLET_CORRECT_TYPE))
  isCorrectType: string;

  @IsArray()
  assignedRoutines: Types.ObjectId[];
}
