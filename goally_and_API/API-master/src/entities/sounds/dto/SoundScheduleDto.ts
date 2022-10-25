import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { IsTimeAmPm } from 'src/shared/validation';

export class TimeDto {
  @IsNotEmpty()
  @IsTimeAmPm()
  startedAt: string;

  @IsNotEmpty()
  @IsTimeAmPm()
  endedAt: string;
}
export class SoundScheduleDto {
  @IsOptional()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => TimeDto)
  Sun: TimeDto;

  @IsOptional()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => TimeDto)
  Mon: TimeDto;

  @IsOptional()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => TimeDto)
  Tue: TimeDto;

  @IsOptional()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => TimeDto)
  Wed: TimeDto;

  @IsOptional()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => TimeDto)
  Thu: TimeDto;

  @IsOptional()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => TimeDto)
  Fri: TimeDto;

  @IsOptional()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => TimeDto)
  Sat: TimeDto;
}
