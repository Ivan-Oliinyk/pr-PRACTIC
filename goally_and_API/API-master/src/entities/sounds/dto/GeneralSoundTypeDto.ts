import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { NEURAL_VOICE_IDS } from 'src/shared/const/client-voices';
import { SoundScheduleDto } from './SoundScheduleDto';
export class GeneralSoundTypeDto {
  @IsNotEmpty()
  @IsBoolean()
  enableSoundSettings: boolean;

  @IsNotEmpty()
  @IsBoolean()
  allowAdjustVolume: boolean;

  @IsNotEmpty()
  @IsBoolean()
  allowChangeSound: boolean;

  @IsNotEmpty()
  @IsString()
  @IsIn(NEURAL_VOICE_IDS)
  voiceId: string;

  @IsNotEmpty()
  @IsNumber()
  @Max(100)
  @Min(0)
  volume: number;

  @IsNotEmpty()
  @IsBoolean()
  enableReduceVolume: boolean;

  @ValidateIf(o => o.enableReduceVolume)
  @IsNotEmpty()
  @IsNumber()
  @Max(100)
  @Min(0)
  reduceVolumeBy: number;

  @ValidateIf(o => o.enableReduceVolume)
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => SoundScheduleDto)
  schedule: SoundScheduleDto;

  @IsOptional()
  @IsNumber()
  @Max(100)
  @Min(0)
  masterVolume: number;

  @IsOptional()
  @IsNotEmpty()
  @IsBoolean()
  vibrateOnClick: boolean;
}
