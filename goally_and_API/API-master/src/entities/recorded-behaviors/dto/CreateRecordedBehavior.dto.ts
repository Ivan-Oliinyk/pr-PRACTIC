import { Transform } from 'class-transformer';
import { IsDateString, IsDefined, IsMongoId, IsString } from 'class-validator';
import { Types } from 'mongoose';
import {
  IsMongoIdObj,
  IsTimeAmPm,
  TransformStringToObjectId,
} from 'src/shared/validation';

export class CreateRecordedBehavior {
  @IsDefined()
  @IsDateString()
  date: Date;

  @IsDefined()
  @IsTimeAmPm()
  time: string;

  @IsString()
  duration: string;

  @IsString()
  severity: string;

  @IsString()
  groupSize: string;

  @IsString()
  location: string;

  @IsString()
  antecedent: string;

  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  clientId: Types.ObjectId;

  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  behaviorId: Types.ObjectId;
}
