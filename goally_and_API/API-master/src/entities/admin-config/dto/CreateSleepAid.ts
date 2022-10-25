import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { AUDIO_TYPES } from 'src/shared/const';
import { urlRegex } from 'src/shared/validation/regexp';

export class CreateSleepAid {
  @MinLength(1)
  @MaxLength(22)
  @IsString()
  @IsNotEmpty()
  audioName: string;

  @ValidateIf(
    o =>
      o.audioName !== AUDIO_TYPES.SILENT &&
      o.audioName !== AUDIO_TYPES.USER_UPLOADED,
  )
  @IsNotEmpty()
  @IsString()
  @Matches(urlRegex, { message: 'Invalid audio url' })
  audioUrl: string;
}
