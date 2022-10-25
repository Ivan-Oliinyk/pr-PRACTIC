import { Transform } from 'class-transformer';
import {
  IsHexColor,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { Types } from 'mongoose';
import { AAC_TEXT_TYPES } from 'src/shared/const/aac-text-types';
import { IsMongoIdObj, TransformStringToObjectId } from 'src/shared/validation';
import { urlRegex } from 'src/shared/validation/regexp';

export class CreateWord {
  @IsNotEmpty()
  @IsString()
  partOfSpeech: string;

  @IsNotEmpty()
  @IsHexColor()
  color: string;

  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  folderId: Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  label: string;

  @IsNotEmpty()
  @IsString()
  text: string;

  @IsNotEmpty()
  @IsString()
  @Matches(urlRegex, { message: 'imageUrl is invalid' })
  visualAid: string;

  @IsOptional()
  @IsString()
  @Matches(urlRegex, { message: 'mp3Url is invalid' })
  mp3Url: string;

  @IsIn(Object.values(AAC_TEXT_TYPES))
  @IsNotEmpty()
  @IsString()
  textType: string;
}
