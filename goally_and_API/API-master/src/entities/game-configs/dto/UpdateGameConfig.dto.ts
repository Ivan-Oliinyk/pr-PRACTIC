import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDefined,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { IsTimeAmPm } from 'src/shared/validation';
import { GameDto } from './Game.dto';

export class UpdatePointsDto {
  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  @Min(1)
  minutesPlayed: number;
}

export class UpdateGameConfigDto {
  @IsOptional()
  @IsNotEmpty()
  @IsBoolean()
  enablePlayLimit: boolean;

  @IsOptional()
  @IsDefined()
  @IsTimeAmPm()
  startTime: string;

  @IsOptional()
  @IsDefined()
  @IsTimeAmPm()
  endTime: string;

  @IsOptional()
  @IsNumber()
  @IsInt()
  @Min(0)
  maxPlayMins: number;

  @ValidateIf(o => o.enablePtsToPlay)
  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  @Min(1)
  ptsFor15Mins: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => GameDto)
  games: GameDto[];

  @IsOptional()
  @IsBoolean()
  enablePtsToPlay: boolean;

  @IsOptional()
  @IsNumber()
  duration: number;
}
