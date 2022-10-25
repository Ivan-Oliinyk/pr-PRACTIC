import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class Answer {
  @IsBoolean()
  correct: boolean;

  @IsString()
  text: string;

  @IsOptional()
  @IsString()
  imgURL?: string;

  @IsOptional()
  assetSetting?: boolean;

  @IsOptional()
  _id?: Types.ObjectId;
}
export const MAX_ANSWERS = 4;
