import { Transform, Type } from 'class-transformer';
import {
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Types } from 'mongoose';
import { IsMongoIdObj, TransformStringToObjectId } from 'src/shared/validation';
import { ContactDto, MIN_CONTACTS } from './ContactDto';
import { MIN_UNIQUE_BEHAVIORS, UniqueBehaviorDto } from './UniqueBehaviorDto';

export class CreateSafetyFeature {
  @IsNotEmpty()
  @IsString()
  learnerDescription: string;

  @IsNotEmpty()
  @IsBoolean()
  showIdCard: boolean;

  @IsNotEmpty()
  @IsString()
  nameOfSchoolOrFVP: string;

  @IsArray()
  @ArrayMinSize(MIN_UNIQUE_BEHAVIORS)
  @ValidateNested({ each: true })
  @Type(() => UniqueBehaviorDto)
  uniqueBehaviors: UniqueBehaviorDto[];

  @IsNotEmpty()
  @IsString()
  additionalNotes: string;

  @IsNotEmpty()
  @IsBoolean()
  allow911Calling: boolean;

  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  clientId: Types.ObjectId;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(MIN_CONTACTS)
  @ValidateNested({ each: true })
  @Type(() => ContactDto)
  contacts: ContactDto[];
}
