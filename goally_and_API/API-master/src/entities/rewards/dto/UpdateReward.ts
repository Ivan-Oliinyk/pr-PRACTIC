import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateReward {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  points: number;

  @IsOptional()
  @IsBoolean()
  showOnDevice: boolean;

  @IsOptional()
  @IsBoolean()
  allowRedeem: boolean;

  @IsOptional()
  @IsString()
  imgURL: string;

  @IsOptional()
  assetSetting: boolean;

  @IsOptional()
  @IsBoolean()
  isVisibleToAudience: boolean;

  @IsOptional()
  @IsBoolean()
  isMarkedHot: boolean;

  @IsOptional()
  @IsBoolean()
  addOnUserCreation: boolean;

  @IsOptional()
  @IsBoolean()
  addOnClientCreation: boolean;
}
