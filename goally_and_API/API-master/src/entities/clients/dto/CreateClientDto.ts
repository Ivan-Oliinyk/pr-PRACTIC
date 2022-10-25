import { Transform } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import { Types } from 'mongoose';
import { TEMP_UNITS, timezones } from 'src/shared/const';
import { IsMongoIdObj, TransformStringToObjectId } from 'src/shared/validation';
import { namePattern } from 'src/shared/validation/regexp';

export class CreateClientDto {
  @IsNotEmpty()
  @Matches(namePattern)
  @MinLength(1)
  firstName: string;

  @IsNotEmpty()
  @Matches(namePattern)
  @MinLength(1)
  lastName: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth: Date;

  @IsOptional()
  schoolName: string;

  @IsOptional()
  teacherName: string;

  @IsOptional()
  diagnosis: string;

  @IsOptional()
  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  device: Types.ObjectId;

  @IsOptional()
  @IsString()
  avatarURL: string;

  @IsNotEmpty()
  @IsIn(timezones.map(e => e.value))
  timezone: string;

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
  @IsIn(Object.values(TEMP_UNITS))
  tempUnit: string;

  @IsNotEmpty()
  isSiteLicense: boolean;

  @IsOptional()
  enableBstApp: boolean;

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
  @IsMongoIdObj()
  @Transform(TransformStringToObjectId)
  subscriptionId: Types.ObjectId;

  @IsOptional()
  enableWordLabApp: boolean;
}
