import {
  IsBoolean,
  IsDefined,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateBehavior {
  @IsOptional()
  @IsString()
  @IsDefined()
  name: string;

  @IsOptional()
  @IsInt()
  points: number;

  @IsOptional()
  @IsBoolean()
  showOnDevice: boolean;

  @IsOptional()
  @IsString()
  imgURL: string;
}
