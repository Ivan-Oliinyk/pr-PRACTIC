import { IsOptional, IsString } from 'class-validator';
import { IsTimeAmPm } from 'src/shared/validation';

export class ScheduleDto {
  @IsOptional()
  @IsString()
  @IsTimeAmPm()
  Sun: string | null;

  @IsOptional()
  @IsString()
  @IsTimeAmPm()
  @IsString()
  Mon: string | null;

  @IsOptional()
  @IsString()
  @IsTimeAmPm()
  @IsString()
  Tue: string | null;

  @IsOptional()
  @IsString()
  @IsTimeAmPm()
  @IsString()
  Wed: string | null;

  @IsOptional()
  @IsString()
  @IsTimeAmPm()
  @IsString()
  Thu: string | null;

  @IsString()
  @IsOptional()
  @IsString()
  @IsTimeAmPm()
  Fri: string | null;

  @IsOptional()
  @IsString()
  @IsTimeAmPm()
  @IsString()
  Sat: string | null;
}
