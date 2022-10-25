import {
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { DEVICE_PLATFORMS } from 'src/shared/const/device-platform';

export class InitDeviceDto {
  @IsNotEmpty()
  uniqIdentifier: string;

  @IsOptional()
  appId: string;

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
  @IsString()
  wifiName: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
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
  @IsNumber()
  memorySize: number;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(100)
  brightnessLevel: number;
}
