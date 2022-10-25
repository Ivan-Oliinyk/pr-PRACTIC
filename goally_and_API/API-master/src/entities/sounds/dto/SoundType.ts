import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { AudioDto, MAX_AUDIO_LIST_SIZE, MIN_AUDIO_LIST_SIZE } from './AudioDto';

export class SoundTypeDto {
  @IsNotEmpty()
  @IsString()
  event: string;

  @IsNotEmpty()
  @IsNumber()
  @Max(100)
  @Min(0)
  volume: number;

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(MIN_AUDIO_LIST_SIZE)
  @ArrayMaxSize(MAX_AUDIO_LIST_SIZE)
  @ValidateNested({ each: true })
  @Type(() => AudioDto)
  audioList: AudioDto[];
}

export const MIN_VISUAL_SCHEDULE_LIST_SIZE = 1;
export const MAX_VISUAL_SCHEDULE_LIST_SIZE = 5;

export const MIN_REWARD_LIST_SIZE = 1;
export const MAX_REWARD_LIST_SIZE = 1;

export const MIN_BEHAVIOR_LIST_SIZE = 1;
export const MAX_BEHAVIOR_LIST_SIZE = 2;

export const MIN_PUZZLE_LIST_SIZE = 1;
export const MAX_PUZZLE_LIST_SIZE = 3;

export const MIN_TIMER_LIST_SIZE = 1;
export const MAX_TIMER_LIST_SIZE = 2;

export const MIN_GENERAL_LIST_SIZE = 1;
export const MAX_GENERAL_LIST_SIZE = 1;
