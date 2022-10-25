import {
  IsBoolean,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { DEVICE_PLATFORMS } from 'src/shared/const/device-platform';

export class UpdateDeviceDto {
  @IsOptional()
  @IsBoolean()
  wifiConnected: boolean;

  @IsOptional()
  @IsNumber()
  @Max(100)
  @Min(0)
  batteryLevel: number;

  @IsOptional()
  @IsString()
  fcmToken: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  appVersion: number;

  @IsOptional()
  appId: string;

  @IsOptional()
  @IsString()
  wifiName: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  wifiStrength: number;

  @IsOptional()
  @IsString()
  @IsIn(Object.values(DEVICE_PLATFORMS))
  platform: string;

  @IsOptional()
  @IsString()
  osVersion: string;

  @IsOptional()
  @IsString()
  manufacturer: string;

  @IsOptional()
  @IsString()
  _model: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  screenWidth: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  screenHeight: number;

  @IsOptional()
  @IsString()
  sku: string;

  @IsOptional()
  @IsString()
  imei: string;

  @IsOptional()
  @IsString()
  imsi: string;

  @IsOptional()
  @IsString()
  deviceName: string;
}
