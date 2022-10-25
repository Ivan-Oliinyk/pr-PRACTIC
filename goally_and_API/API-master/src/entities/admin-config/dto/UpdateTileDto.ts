import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { TILE_CATEGORIES } from 'src/shared/const';
import { urlRegex } from 'src/shared/validation/regexp';

export class UpdateTileDto {
  @IsString()
  @IsNotEmpty()
  headline: string;

  @IsString()
  @IsNotEmpty()
  @Matches(urlRegex, { message: 'url is invalid' })
  url: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @IsIn([TILE_CATEGORIES.USER, TILE_CATEGORIES.JOURNEY])
  category: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Matches(urlRegex, { message: 'detailUrl is invalid' })
  detailUrl: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  detailsDescription: string;

  @IsNotEmpty()
  @IsNumber()
  appearAfterDays: number;

  @IsNotEmpty()
  @IsNumber()
  position: number;

  updatedAt: Date;
}
