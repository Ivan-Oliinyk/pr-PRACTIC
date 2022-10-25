import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateAppVersionDto {
  @IsNumber()
  version: number;

  @IsString()
  url: string;

  @IsBoolean()
  isForMigrated: boolean;
}
