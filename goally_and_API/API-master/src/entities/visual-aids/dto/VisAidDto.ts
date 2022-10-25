import {
  IsArray,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Min,
} from 'class-validator';
import { AIDS_CATEGORIES } from 'src/shared/const/visual-aid-categories';
import { AIDS_TYPES } from 'src/shared/const/visual-aid-types';
import { urlRegex } from 'src/shared/validation/regexp';

export class VisAidDto {
  @IsNotEmpty()
  @IsString()
  @Matches(urlRegex, { message: 'Url is invalid' })
  url: string;

  @IsOptional()
  @IsArray()
  tags: string[];

  @IsIn(Object.values(AIDS_CATEGORIES))
  @IsNotEmpty()
  @IsString()
  category: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsIn(Object.values(AIDS_TYPES))
  @IsNotEmpty()
  @IsString()
  aidType: string;

  @IsOptional()
  @Min(1)
  @IsNumber()
  size: number;
}
