import {
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { VOICE_IDS } from 'src/shared/const/aac-voices';

export class AacConfigDto {
  @IsNotEmpty()
  @IsBoolean()
  isSpeakOnSentenceComplete: boolean;

  @IsNotEmpty()
  @IsBoolean()
  isVibrateOnClick: boolean;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(100)
  wordClickVolume: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(100)
  talkerVolume: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(1)
  aacPoints: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(3)
  clickDelayinSec: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(50)
  clickSensitivity: number;

  @IsNotEmpty()
  @IsBoolean()
  isAutoClearMessage: boolean;

  @IsNotEmpty()
  @Min(50)
  @Max(150)
  @IsNumber()
  speechSpeed: number;

  @IsNotEmpty()
  @IsString()
  @IsIn(VOICE_IDS)
  voiceId: string;

  @IsNotEmpty()
  @IsBoolean()
  enableSubwords: boolean;
}
