import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class Attribute {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  _id?: Types.ObjectId;
}
export const MIN_ATTRIBUTES = 1;
export const MAX_ATTRIBUTES = 4;
