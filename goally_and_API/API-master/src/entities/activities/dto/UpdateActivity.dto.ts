import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { GreaterOrEqualThen } from 'src/shared/validation';

export class UpdateActivityDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  @Min(0.1)
  @Max(999)
  minCompletionTime: number;

  @IsOptional()
  @Min(0.1)
  @Max(999)
  @IsNumber()
  @GreaterOrEqualThen('minCompletionTime')
  maxCompletionTime: number;

  @IsOptional()
  @IsString()
  audioUrl: string;

  @IsOptional()
  @IsString()
  imgURL: string;

  @IsOptional()
  @IsBoolean()
  allowCancelActivity: boolean;

  @IsOptional()
  @IsBoolean()
  allowPauseActivity: boolean;

  @IsOptional()
  @IsBoolean()
  allowPause: boolean;

  @IsOptional()
  @IsNumber()
  ordering: number;

  @IsOptional()
  assetSetting?: boolean;

  @IsOptional()
  @IsBoolean()
  autoComplete: boolean;
}
