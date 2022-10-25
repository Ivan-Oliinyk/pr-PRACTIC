import { Transform } from 'class-transformer';
import {
  IsHexColor,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  ValidateIf,
} from 'class-validator';
import { Types } from 'mongoose';
import { AAC_TEXT_TYPES } from 'src/shared/const/aac-text-types';
import { AAC_VISUAL_AID_TYPES } from 'src/shared/const/aac-visual-aids';
import { IsMongoIdObj, TransformStringToObjectId } from 'src/shared/validation';
import { aacUrlRegex, urlRegex } from 'src/shared/validation/regexp';

export class UpdateWord {
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

  @ValidateIf(o => o.type === AAC_VISUAL_AID_TYPES.IMAGE)
  @IsNotEmpty()
  @IsString()
  @Matches(aacUrlRegex, { message: 'imageUrl is invalid' })
  visualAid: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(Object.values(AAC_VISUAL_AID_TYPES))
  visualAidType: string;

  @IsOptional()
  @IsString()
  @Matches(urlRegex, { message: 'mp3Url is invalid' })
  mp3Url: string;

  @IsIn(Object.values(AAC_TEXT_TYPES))
  @IsNotEmpty()
  @IsString()
  textType: string;
}
