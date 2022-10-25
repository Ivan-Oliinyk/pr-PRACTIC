import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';
import { Types } from 'mongoose';
import {
  Answer,
  MAX_ANSWERS,
  MIN_ANSWERS,
} from 'src/entities/behavior-trainings/training-segments/dto/AnswerDto';
import { Rehearsal } from 'src/entities/completed-trainings/dto/ChildCompleteRehearsalTraining.dto';
import { IsMongoIdObj, TransformStringToObjectId } from 'src/shared/validation';
import { urlRegex } from 'src/shared/validation/regexp';
import { Attribute, MAX_ATTRIBUTES, MIN_ATTRIBUTES } from './AttributeDto';

export class CreateTrainingSegment {
  @IsOptional()
  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  _id?: Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @Matches(urlRegex, { message: 'positiveVideoURL is invalid' })
  positiveVideoURL: string;

  @IsOptional()
  @IsString()
  @Matches(urlRegex, { message: 'negativeVideoURL is invalid' })
  negativeVideoURL: string;

  @IsArray()
  @ArrayMinSize(MIN_ATTRIBUTES)
  @ArrayMaxSize(MAX_ATTRIBUTES)
  @ValidateNested({ each: true })
  @Type(() => Attribute)
  attributes: Attribute[];

  @IsNotEmpty()
  @IsString()
  question: string;

  @IsArray()
  @ArrayMinSize(MIN_ANSWERS)
  @ArrayMaxSize(MAX_ANSWERS)
  @ValidateNested({ each: true })
  @Type(() => Answer)
  answers: Answer[];

  @IsOptional()
  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  clientId?: Types.ObjectId;

  @IsOptional()
  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  createdBy?: Types.ObjectId;

  //general behavior-training
  @IsOptional()
  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  clientAnswerId?: Types.ObjectId;
  @IsOptional()
  @IsBoolean()
  isCorrectAnswer: boolean;

  //rehersal behavior-training
  @IsOptional()
  @IsNumber()
  freqOfRehears: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Rehearsal)
  rehearsals: Rehearsal[];
}
