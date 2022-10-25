import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  ValidateIf,
} from 'class-validator';
import { aacUrlRegex, urlRegex } from 'src/shared/validation/regexp';

export class NotificationDto {
  @IsNumber()
  @IsNotEmpty()
  minutesBefore: number;

  @IsNotEmpty()
  @IsBoolean()
  isReadReminderSoundEnabled: boolean;

  @IsNotEmpty()
  @IsBoolean()
  isPositiveReinfoSoundEnabled: boolean;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Matches(urlRegex, { message: 'positiveReinfoSoundUrl is invalid' })
  positiveReinfoSoundUrl: string;

  @IsNotEmpty()
  @IsBoolean()
  isNotificationSoundEnabled: boolean;

  @ValidateIf(o => o.isNotificationSoundEnabled)
  @IsNotEmpty()
  @IsString()
  @Matches(aacUrlRegex, { message: 'notificationSoundUrl is invalid' })
  notificationSoundUrl: string;
}
