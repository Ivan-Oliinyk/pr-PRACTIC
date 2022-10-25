import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  Matches,
  ValidateIf,
} from 'class-validator';
import { urlRegex } from 'src/shared/validation/regexp';

export class AudioDto {
  @IsNotEmpty()
  @IsBoolean()
  isSelected: boolean;

  @IsNotEmpty()
  @IsString()
  name: string;

  @ValidateIf(o => o.name.toLowerCase() !== SILENT)
  @IsNotEmpty()
  @IsString()
  @Matches(urlRegex)
  url: string;
}

export const MIN_AUDIO_LIST_SIZE = 5;
export const MAX_AUDIO_LIST_SIZE = 17;
export const SILENT = 'silent';
