import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsHexColor,
  IsIn,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Types } from 'mongoose';
import { IsMongoIdObj, TransformStringToObjectId } from 'src/shared/validation';
import { urlRegex } from 'src/shared/validation/regexp';
import { AUDIO_TYPES, SLEEP_MODE } from '../../../shared/const';
import { ScheduleDto } from '../../routines/dto/ScheduleDto';

export class SleepModeDto {
  @IsNotEmpty()
  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  clientId: Types.ObjectId;

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => ScheduleDto)
  schedule: ScheduleDto;

  @IsNotEmpty()
  @IsNumber()
  @Min(SLEEP_MODE.MIN_SLEEP_DURATION, {
    message: `Minimum sleep duration is ${SLEEP_MODE.MIN_SLEEP_DURATION} minutes`,
  })
  @Max(SLEEP_MODE.MAX_SLEEP_DURATION, {
    message: `Maximum sleep duration is ${SLEEP_MODE.MAX_SLEEP_DURATION} minutes`,
  })
  duration: number;

  @IsNotEmpty()
  @IsIn([
    AUDIO_TYPES.SILENT,
    AUDIO_TYPES.SYSTEM_UPLOADED,
    AUDIO_TYPES.USER_UPLOADED,
  ])
  audioType: string;

  @ValidateIf(
    o =>
      o.audioType == AUDIO_TYPES.USER_UPLOADED ||
      o.audioType == AUDIO_TYPES.SYSTEM_UPLOADED,
  )
  @IsNotEmpty()
  @IsString()
  @Matches(urlRegex, { message: 'Invalid URL' })
  audioUrl: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(SLEEP_MODE.MIN_AUDIO_DURATION, {
    message: `Minimum audio duration is ${SLEEP_MODE.MIN_AUDIO_DURATION} minutes`,
  })
  @Max(SLEEP_MODE.MAX_AUDIO_DURATION, {
    message: `Maximum audio duration is ${SLEEP_MODE.MAX_AUDIO_DURATION} minutes`,
  })
  audioDuration: number;

  @IsNotEmpty()
  @IsString()
  @Matches(urlRegex, { message: 'Invalid URL' })
  videoUrl: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(SLEEP_MODE.MIN_VISUAL_DURATION, {
    message: `Minimum visual duration is ${SLEEP_MODE.MIN_VISUAL_DURATION} minutes`,
  })
  @Max(SLEEP_MODE.MAX_VISUAL_DURATION, {
    message: `Maximum visual duration is ${SLEEP_MODE.MAX_VISUAL_DURATION} minutes`,
  })
  videoDuration: number;

  @IsNotEmpty()
  @IsString()
  @IsHexColor()
  asleepColor: string;

  @IsNotEmpty()
  @IsString()
  @IsHexColor()
  backtoBedColor: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(SLEEP_MODE.MIN_BACK_TO_BED_DURATION, {
    message: `Minimum back to bed duration is ${SLEEP_MODE.MIN_BACK_TO_BED_DURATION} minutes`,
  })
  @Max(SLEEP_MODE.MAX_BACK_TO_BED_DURATION, {
    message: `Maximum back to bed duration is ${SLEEP_MODE.MAX_BACK_TO_BED_DURATION} minutes`,
  })
  backtoBedDuration: number;

  @IsNotEmpty()
  @IsBoolean()
  isWakeUpCelebration: boolean;

  @ValidateIf(o => o.isWakeUpCelebration)
  @IsNotEmpty()
  @IsString()
  @Matches(urlRegex, { message: 'Invalid URL' })
  wakeUpVideo: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(SLEEP_MODE.MIN_VOLUME)
  @Max(SLEEP_MODE.MAX_VOLUME)
  soundVolume: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(SLEEP_MODE.MIN_BRIGHTNESS)
  @Max(SLEEP_MODE.MAX_BRIGHTNESS)
  screenBrightness: number;

  @IsNotEmpty()
  @IsString()
  @Matches(urlRegex, { message: 'Invalid URL' })
  thumbnailUrl: string;

  @IsOptional()
  @IsBoolean()
  startAfterNightRoutine: boolean;
}
