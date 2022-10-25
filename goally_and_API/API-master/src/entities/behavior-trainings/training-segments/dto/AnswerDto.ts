import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class Answer {
  @IsBoolean()
  isCorrect: boolean;

  @IsNotEmpty()
  @IsString()
  text: string;

  @IsOptional()
  _id?: Types.ObjectId;
}
export const MIN_ANSWERS = 2;
export const MAX_ANSWERS = 4;
