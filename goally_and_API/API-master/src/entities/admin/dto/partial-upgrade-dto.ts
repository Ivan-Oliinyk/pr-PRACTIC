import { IsArray, IsInt, IsNumber, IsOptional } from 'class-validator';

export class PartialUpgradeDto {
  @IsOptional()
  @IsArray()
  emails: string[];

  @IsOptional()
  @IsArray()
  deviceCodes: string[];

  @IsOptional()
  desiredAppVersion: number;
}
