import {
  IsBoolean,
  IsDefined,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { LIBRARY_TYPES } from 'src/shared/const';

export class CreateBehavior {
  @IsString()
  @IsDefined()
  name: string;

  @IsInt()
  points: number;

  @IsBoolean()
  showOnDevice: boolean;

  @IsIn([LIBRARY_TYPES.ADULT, LIBRARY_TYPES.CHILD])
  libraryType: string;

  @Min(0)
  @IsOptional()
  @IsNumber()
  ordering: number;

  @IsOptional()
  @IsString()
  imgURL?: string;
}
