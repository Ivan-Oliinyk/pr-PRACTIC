import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Types } from 'mongoose';
import { PUZZLES_PER_ROUTINE, TEMP_UNITS, timezones } from 'src/shared/const/';
import {
  IsMongoIdObj,
  IsUniqArrayOfIds,
  TransformStringToObjectId,
} from 'src/shared/validation';
import { namePattern } from 'src/shared/validation/regexp';
import { AacConfigDto } from './AacConfigDto';
import { BalloonConfigDto } from './BalloonConfigDto';
import { ThemeConfigDto } from './ThemeConfigDto';

export class UpdateClientDto {
  @IsOptional()
  @Matches(namePattern)
  @MinLength(1)
  @MaxLength(20)
  firstName: string;

  @IsOptional()
  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  device: Types.ObjectId;

  @IsOptional()
  @Matches(namePattern)
  @MinLength(1)
  @MaxLength(20)
  lastName: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth: Date;

  @IsOptional()
  @IsString()
  country: string;

  @IsOptional()
  @IsString()
  state: string;

  @IsOptional()
  @IsString()
  avatarURL: string;

  @IsOptional()
  schoolName: string;

  @IsOptional()
  clinicName: string;

  @IsOptional()
  diagnosis: string;

  @IsOptional()
  @IsArray()
  @IsUniqArrayOfIds()
  routines: Types.ObjectId[];

  @IsOptional()
  @IsArray()
  @IsUniqArrayOfIds()
  rewards: Types.ObjectId[];

  @IsOptional()
  @IsNumber()
  @IsInt()
  @Min(0)
  points: number;

  @IsOptional()
  @IsBoolean()
  allowPuzzles: boolean;

  @IsOptional()
  @IsIn(Object.values(PUZZLES_PER_ROUTINE))
  puzzlesPerRoutine: number;

  @IsOptional()
  enableVisualScheduleApp: boolean;

  @IsOptional()
  enableRewardApp: boolean;

  @IsOptional()
  enableBehaviorTrackerApp: boolean;

  @IsOptional()
  enableTimerApp: boolean;

  @IsOptional()
  hideGearIcon: boolean;

  @IsOptional()
  allowChildToRedeemRewards: boolean;

  @IsOptional()
  enableWeather: boolean;

  @IsOptional()
  @IsNotEmpty()
  postalCode: string;

  @IsOptional()
  @IsNotEmpty()
  @IsIn(timezones.map(e => e.value))
  timezone: string;

  @IsOptional()
  @IsNotEmpty()
  address: string;

  @IsOptional()
  enableDigitalClock: boolean;

  @IsOptional()
  enableDaySchedule: boolean;

  @IsOptional()
  enableBalloonApp: boolean;

  @IsOptional()
  enableTalkerApp: boolean;

  @IsOptional()
  enableSafetyApp: boolean;

  @IsOptional()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => AacConfigDto)
  aacConfig: AacConfigDto;

  @IsOptional()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => BalloonConfigDto)
  balloonConfig: BalloonConfigDto;

  @IsOptional()
  @IsIn(Object.values(TEMP_UNITS))
  tempUnit: string;

  @IsOptional()
  enableBstApp: boolean;

  @IsOptional()
  @IsNotEmpty()
  deviceName: string;

  @IsOptional()
  @IsNumber()
  @Min(0.1)
  @Max(100)
  age: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(12)
  birthMonth: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(31)
  birthDay: number;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(3)
  workGoals: string[];

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  identifications: string[];

  @IsOptional()
  enableSleepApp: boolean;

  @IsOptional()
  enableReminderApp: boolean;

  @IsOptional()
  enableChecklistApp: boolean;

  @IsOptional()
  enableGameGarageApp: boolean;

  @IsOptional()
  enableWordLabApp: boolean;

  @IsOptional()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => ThemeConfigDto)
  themeConfig: ThemeConfigDto;
}
