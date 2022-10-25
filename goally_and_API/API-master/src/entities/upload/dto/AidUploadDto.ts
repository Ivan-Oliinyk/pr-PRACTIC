import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AIDS_CATEGORIES } from 'src/shared/const/visual-aid-categories';
import { AIDS_TYPES } from 'src/shared/const/visual-aid-types';

export class AidUploadDto {
  @IsIn(Object.values(AIDS_CATEGORIES))
  @IsNotEmpty()
  @IsString()
  category: string;

  @IsIn(Object.values(AIDS_TYPES))
  @IsNotEmpty()
  @IsString()
  type: string;

  @IsOptional()
  w: number;

  @IsOptional()
  h: number;

  @IsOptional()
  x: number;

  @IsOptional()
  y: number;
}
