import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmptyObject,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { GeneralSoundTypeDto } from './GeneralSoundTypeDto';
import {
  MAX_BEHAVIOR_LIST_SIZE,
  MAX_GENERAL_LIST_SIZE,
  MAX_PUZZLE_LIST_SIZE,
  MAX_REWARD_LIST_SIZE,
  MAX_TIMER_LIST_SIZE,
  MAX_VISUAL_SCHEDULE_LIST_SIZE,
  MIN_BEHAVIOR_LIST_SIZE,
  SoundTypeDto,
} from './SoundType';

export class CreateSoundDto {
  @IsOptional()
  @IsArray()
  @ArrayMinSize(MAX_GENERAL_LIST_SIZE)
  @ArrayMaxSize(MAX_GENERAL_LIST_SIZE)
  @ValidateNested({ each: true })
  @Type(() => SoundTypeDto)
  general: SoundTypeDto[];

  @IsOptional()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => GeneralSoundTypeDto)
  generalNew: GeneralSoundTypeDto;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(MAX_VISUAL_SCHEDULE_LIST_SIZE)
  @ArrayMaxSize(MAX_VISUAL_SCHEDULE_LIST_SIZE)
  @ValidateNested({ each: true })
  @Type(() => SoundTypeDto)
  visualScdedule: SoundTypeDto[];

  @IsOptional()
  @IsArray()
  @ArrayMinSize(MAX_PUZZLE_LIST_SIZE)
  @ArrayMaxSize(MAX_PUZZLE_LIST_SIZE)
  @ValidateNested({ each: true })
  @Type(() => SoundTypeDto)
  puzzle: SoundTypeDto[];

  @IsOptional()
  @IsArray()
  @ArrayMinSize(MAX_TIMER_LIST_SIZE)
  @ArrayMaxSize(MAX_TIMER_LIST_SIZE)
  @ValidateNested({ each: true })
  @Type(() => SoundTypeDto)
  timer: SoundTypeDto[];

  @IsOptional()
  @IsArray()
  @ArrayMinSize(MAX_REWARD_LIST_SIZE)
  @ArrayMaxSize(MAX_REWARD_LIST_SIZE)
  @ValidateNested({ each: true })
  @Type(() => SoundTypeDto)
  reward: SoundTypeDto[];

  @IsOptional()
  @IsArray()
  @ArrayMinSize(MIN_BEHAVIOR_LIST_SIZE)
  @ArrayMaxSize(MAX_BEHAVIOR_LIST_SIZE)
  @ValidateNested({ each: true })
  @Type(() => SoundTypeDto)
  behavior: SoundTypeDto[];
}
